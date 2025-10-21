# main.py - 答辩级飞机大战游戏
import pygame
import random
import os
from gif_background import GifBackground

# 初始化
pygame.init()
pygame.mixer.init()

# 屏幕设置
WIDTH, HEIGHT = 480, 720
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("飞机大战 - 期中答辩项目")

# 颜色
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 200, 0)
YELLOW = (255, 200, 0)
GREY = (40, 40, 40)

# 资源路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(BASE_DIR, 'assets', 'images')
SND_DIR = os.path.join(BASE_DIR, 'assets', 'sounds')

# 加载图片
def load_image(name, scale=None, rotation=None):
    img = pygame.image.load(os.path.join(IMG_DIR, name)).convert_alpha()
    if scale:
        img = pygame.transform.scale(img, scale)
    if rotation:
        img = pygame.transform.rotate(img, rotation)
    return img

background_img = load_image('background.png', (WIDTH, HEIGHT))
menu_bg_img = load_image('plane_war_background.png', (WIDTH, HEIGHT))  # 菜单和结束界面背景
gif_bg = GifBackground(os.path.join(IMG_DIR, 'preview.gif'), WIDTH, HEIGHT)  # 游戏中的动态GIF背景
player_img = load_image('newair.png', (50, 40))
enemy_img = load_image('player.png', (40, 30), 180)  # 敌机180度旋转
bullet_img = load_image('bullet.png', (10, 20), 90)  # 子弹90度旋转
shield_img = load_image('spr_shield.png', (60, 60))  # 护盾图片

# 加载音效
shoot_sound = pygame.mixer.Sound(os.path.join(SND_DIR, 'shoot.mp3'))
explosion_sound = pygame.mixer.Sound(os.path.join(SND_DIR, 'explosion.mp3'))
pygame.mixer.music.load(os.path.join(SND_DIR, 'background.ogg'))
pygame.mixer.music.set_volume(0.3)
pygame.mixer.music.play(-1)  # 循环播放

# 字体
font_name = pygame.font.match_font('SimHei', 'Arial', 'sans-serif')  # 支持中文

def draw_text(surf, text, size, x, y, color=WHITE):
    font = pygame.font.Font(font_name, size)
    text_surface = font.render(text, True, color)
    text_rect = text_surface.get_rect()
    text_rect.midtop = (x, y)
    surf.blit(text_surface, text_rect)

# 缓存字体对象
_font_cache = {}

def draw_text_shadow(surf, text, size, x, y, color=WHITE, shadow_color=BLACK, offset=(2, 2)):
    if size not in _font_cache:
        _font_cache[size] = pygame.font.Font(font_name, size)
    font = _font_cache[size]
    shadow_surface = font.render(text, True, shadow_color)
    text_surface = font.render(text, True, color)
    shadow_rect = shadow_surface.get_rect()
    shadow_rect.midtop = (x + offset[0], y + offset[1])
    text_rect = text_surface.get_rect()
    text_rect.midtop = (x, y)
    surf.blit(shadow_surface, shadow_rect)
    surf.blit(text_surface, text_rect)

def draw_health_bar(surf, x, y, w, h, percent):
    percent = max(0, min(100, percent))
    # 背景与边框
    pygame.draw.rect(surf, GREY, (x, y, w, h), border_radius=6)
    inner_w = int(w * (percent / 100.0))
    bar_color = GREEN if percent > 50 else YELLOW if percent > 20 else RED
    if inner_w > 0:
        pygame.draw.rect(surf, bar_color, (x, y, inner_w, h), border_radius=6)
    pygame.draw.rect(surf, WHITE, (x, y, w, h), width=2, border_radius=6)

def draw_score_top_right(surf, score, y=10):
    text = f"得分: {score}"
    font = pygame.font.Font(font_name, 22)
    ts = font.render(text, True, WHITE)
    rect = ts.get_rect()
    rect.top = y
    rect.right = WIDTH - 16
    # 阴影
    shadow = font.render(text, True, BLACK)
    shadow_rect = shadow.get_rect()
    shadow_rect.top = y + 2
    shadow_rect.right = WIDTH - 16 + 2
    surf.blit(shadow, shadow_rect)
    surf.blit(ts, rect)

def show_menu():
    screen.blit(menu_bg_img, (0, 0))
    draw_text_shadow(screen, "飞机大战", 64, WIDTH//2, HEIGHT//4, (0, 200, 255))
    draw_text_shadow(screen, "方向键移动 · 空格开火", 26, WIDTH//2, HEIGHT//2 - 30)
    draw_text_shadow(screen, "S键激活护盾 · P暂停/继续", 22, WIDTH//2, HEIGHT//2 + 10)
    draw_text_shadow(screen, "每300分获得护盾(最多3个)", 18, WIDTH//2, HEIGHT//2 + 40)
    draw_text_shadow(screen, "按任意键开始", 28, WIDTH//2, HEIGHT*3//4)
    pygame.display.flip()
    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                exit()
            if event.type == pygame.KEYUP:
                waiting = False

# 玩家飞机
class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = player_img
        self.rect = self.image.get_rect()
        self.rect.centerx = WIDTH // 2
        self.rect.bottom = HEIGHT - 10
        self.speed = 8
        self.health = 100
        self.shield_active = False
        self.shield_duration = 0
        self.shield_max_duration = 300  # 护盾持续5秒（60fps * 5）
        self.shield_count = 0  # 存储的护盾数量

    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] and self.rect.left > 0:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT] and self.rect.right < WIDTH:
            self.rect.x += self.speed
        
        # 护盾更新
        if self.shield_active:
            self.shield_duration -= 1
            if self.shield_duration <= 0:
                self.shield_active = False
    
    def activate_shield(self):
        """激活护盾"""
        if self.shield_count > 0 and not self.shield_active:
            self.shield_active = True
            self.shield_duration = self.shield_max_duration
            self.shield_count -= 1  # 消耗一个护盾
            return True
        return False
    
    def add_shield(self):
        """获得一个护盾"""
        if self.shield_count < 3:  # 最多存储3个护盾
            self.shield_count += 1
    
    def draw_shield(self, screen):
        """绘制护盾"""
        if self.shield_active:
            # 获取护盾图片的尺寸
            shield_width, shield_height = shield_img.get_size()
            # 创建护盾矩形，以飞机中心为中心
            shield_rect = pygame.Rect(0, 0, shield_width, shield_height)
            shield_rect.center = self.rect.center
            screen.blit(shield_img, shield_rect)

# 敌机
class Enemy(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = enemy_img
        self.rect = self.image.get_rect()
        self.rect.x = random.randint(0, WIDTH - self.rect.width)
        self.rect.y = random.randint(-100, -40)
        self.speed = random.randint(1, 3)  # 降低敌机飞行速度
        self.last_shot = 0
        self.shoot_delay = random.randint(2000, 4000)  # 2-4秒随机射击间隔
        self.has_shot_on_spawn = False  # 是否已经在出现时射击过

    def update(self):
        self.rect.y += self.speed
        if self.rect.top > HEIGHT:
            self.rect.x = random.randint(0, WIDTH - self.rect.width)
            self.rect.bottom = 0
            self.has_shot_on_spawn = False  # 重置射击标志
    
    def can_shoot(self):
        """检查是否可以射击"""
        current_time = pygame.time.get_ticks()
        if current_time - self.last_shot > self.shoot_delay:
            self.last_shot = current_time
            return True
        return False
    
    def should_shoot_on_spawn(self):
        """检查是否应该在出现时射击"""
        if not self.has_shot_on_spawn and self.rect.y > -50 and self.rect.y < 50:
            self.has_shot_on_spawn = True
            return True
        return False

# 子弹
class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = bullet_img
        self.rect = self.image.get_rect()
        self.rect.centerx = x
        self.rect.bottom = y
        self.speed = 10

    def update(self):
        self.rect.y -= self.speed
        if self.rect.bottom < 0:
            self.kill()

# 敌机子弹
class EnemyBullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = bullet_img
        self.rect = self.image.get_rect()
        self.rect.centerx = x
        self.rect.bottom = y + 20  # 从敌机下方20像素处发射，避免贴在一起
        self.speed = 8  # 增加敌机子弹速度

    def update(self):
        self.rect.y += self.speed
        if self.rect.top > HEIGHT:
            self.kill()

# 游戏主函数
def main_game():
    all_sprites = pygame.sprite.Group()
    enemies = pygame.sprite.Group()
    bullets = pygame.sprite.Group()
    enemy_bullets = pygame.sprite.Group()

    player = Player()
    all_sprites.add(player)

    # 创建初始敌机（6个）
    for _ in range(6):
        enemy = Enemy()
        all_sprites.add(enemy)
        enemies.add(enemy)

    score = 0
    running = True
    paused = False
    last_shield_score = 0  # 上次获得护盾的分数

    # 进度/升级
    player_level = 1
    kill_count = 0
    level_threshold_per_level = 10  # 每级需要的击杀数
    base_enemy_count = 6  # 基础敌机数量

    def spawn_bullets_for_level(center_x, top_y, level):
        # 按等级发射多枚直线子弹（横向散开）
        if level <= 1:
            offsets = [0]
        elif level == 2:
            offsets = [-8, 8]
        elif level == 3:
            offsets = [-14, 0, 14]
        elif level == 4:
            offsets = [-20, -7, 7, 20]
        else:
            offsets = [-24, -12, 0, 12, 24]
        created = []
        for dx in offsets:
            b = Bullet(center_x + dx, top_y)
            created.append(b)
        return created

    while running:
        # 事件处理
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return 'quit'
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and not paused:
                    new_bullets = spawn_bullets_for_level(player.rect.centerx, player.rect.top, player_level)
                    for b in new_bullets:
                        all_sprites.add(b)
                        bullets.add(b)
                    shoot_sound.play()
                if event.key == pygame.K_p:
                    paused = not paused
                if event.key == pygame.K_s and not paused:
                    # 按S键激活护盾
                    if player.activate_shield():
                        pass  # 护盾激活成功

        # 更新（暂停时不更新）
        if not paused:
            all_sprites.update()
            gif_bg.update()  # 更新GIF背景动画
            
            # 敌机射击
            for enemy in enemies:
                # 敌机一出现就发射炮弹，或者按正常间隔射击
                if (enemy.should_shoot_on_spawn() or enemy.can_shoot()) and enemy.rect.y > -100:
                    enemy_bullet = EnemyBullet(enemy.rect.centerx, enemy.rect.bottom)
                    all_sprites.add(enemy_bullet)
                    enemy_bullets.add(enemy_bullet)

        # 子弹击中敌机（暂停时不判定）
        if not paused:
            hits = pygame.sprite.groupcollide(enemies, bullets, True, True)
            if hits:
                destroyed = len(hits)
                explosion_sound.play()
                score += 10 * destroyed
                kill_count += destroyed
                
                # 护盾获得：每300分获得一个护盾
                if score >= last_shield_score + 300:
                    player.add_shield()
                    last_shield_score = score
                
                # 升级判定：达到每级阈值则升级，提升子弹数量
                while kill_count >= player_level * level_threshold_per_level and player_level < 5:
                    player_level += 1
                # 按分数增加敌机数量（每50分+1个，最多12个）
                current_enemy_target = min(12, base_enemy_count + int(score // 50))
                for _ in range(destroyed):
                    enemy = Enemy()
                    all_sprites.add(enemy)
                    enemies.add(enemy)
                # 如果目标数量大于当前数量，补充敌机
                while len(enemies) < current_enemy_target:
                    enemy = Enemy()
                    all_sprites.add(enemy)
                    enemies.add(enemy)

        # 玩家与敌机碰撞（暂停时不判定）
        if not paused and pygame.sprite.spritecollide(player, enemies, True):
            if player.shield_active:
                # 护盾状态下不受伤害，但护盾消失
                player.shield_active = False
                player.shield_duration = 0
            else:
                player.health -= 30
                if player.health <= 0:
                    running = False
        
        # 玩家与敌机子弹碰撞（暂停时不判定）
        if not paused:
            bullet_hits = pygame.sprite.spritecollide(player, enemy_bullets, True)
            for hit in bullet_hits:
                if player.shield_active:
                    # 护盾状态下不受伤害，但护盾消失
                    player.shield_active = False
                    player.shield_duration = 0
                else:
                    player.health -= 15  # 子弹伤害较小
                    if player.health <= 0:
                        running = False

        # 绘制
        gif_bg.draw(screen)  # 绘制动态GIF背景
        all_sprites.draw(screen)
        
        # 绘制护盾
        player.draw_shield(screen)
        
        # HUD：右上角得分
        draw_score_top_right(screen, score, y=10)
        
        # 护盾状态显示
        if player.shield_active:
            shield_percent = (player.shield_duration / player.shield_max_duration) * 100
            draw_health_bar(screen, 200, 16, 160, 12, shield_percent)
            draw_text_shadow(screen, "护盾激活", 16, 200 + 40, 30, (0, 200, 255))
        
        # 护盾数量显示
        if player.shield_count > 0:
            draw_text_shadow(screen, f"护盾: {player.shield_count}", 16, 70, 50, (0, 255, 0))
            draw_text_shadow(screen, "按S键激活", 14, 70, 70, (255, 255, 0))
        
        # 飞机下方进度条
        progress_x = player.rect.centerx - 30
        progress_y = player.rect.bottom + 5
        progress_width = 60
        progress_height = 6
        
        # 进度条背景
        pygame.draw.rect(screen, GREY, (progress_x, progress_y, progress_width, progress_height), border_radius=3)
        
        # 进度条填充（基于护盾状态或血量）
        if player.shield_active:
            shield_progress = (player.shield_duration / player.shield_max_duration) * progress_width
            pygame.draw.rect(screen, (0, 200, 255), (progress_x, progress_y, shield_progress, progress_height), border_radius=3)
        else:
            health_progress = (player.health / 100) * progress_width
            bar_color = GREEN if player.health > 50 else YELLOW if player.health > 20 else RED
            pygame.draw.rect(screen, bar_color, (progress_x, progress_y, health_progress, progress_height), border_radius=3)
        
        # 进度条边框
        pygame.draw.rect(screen, WHITE, (progress_x, progress_y, progress_width, progress_height), width=1, border_radius=3)
        
        # 等级显示（在飞机上方）
        level_x = player.rect.centerx
        level_y = player.rect.top - 25
        draw_text_shadow(screen, f"L{player_level}", 18, level_x, level_y, (255, 255, 0))  # 黄色等级显示

        # 暂停叠层
        if paused:
            overlay = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
            overlay.fill((0, 0, 0, 140))
            screen.blit(overlay, (0, 0))
            draw_text_shadow(screen, "已暂停", 48, WIDTH//2, HEIGHT//2 - 40)
            draw_text_shadow(screen, "按 P 继续", 24, WIDTH//2, HEIGHT//2 + 10)

        pygame.display.flip()
        pygame.time.Clock().tick(60)

    return 'game_over', score

# 游戏结束界面
def show_game_over(score):
    screen.blit(menu_bg_img, (0, 0))
    draw_text_shadow(screen, "游戏结束", 64, WIDTH//2, HEIGHT//4)
    draw_text_shadow(screen, f"得分: {score}", 32, WIDTH//2, HEIGHT//2)
    draw_text_shadow(screen, "按 R 重新开始 · Q 退出", 24, WIDTH//2, HEIGHT*3//4)
    pygame.display.flip()

    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return 'quit'
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_r:
                    return 'restart'
                if event.key == pygame.K_q:
                    return 'quit'

# 主循环
def main():
    while True:
        show_menu()
        result = main_game()
        if result == 'quit':
            break
        score = result[1] if isinstance(result, tuple) else 0
        action = show_game_over(score)
        if action == 'quit':
            break

    pygame.quit()

if __name__ == "__main__":
    main()