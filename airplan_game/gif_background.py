#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
动态 GIF 背景类
将 GIF 动画转换为 pygame 可用的动态背景
"""

import os
import pygame
from PIL import Image

class GifBackground:
    def __init__(self, gif_path, screen_width, screen_height):
        """
        初始化 GIF 背景
        :param gif_path: GIF 文件路径
        :param screen_width: 屏幕宽度
        :param screen_height: 屏幕高度
        """
        self.screen_width = screen_width
        self.screen_height = screen_height
        self.frames = []
        self.current_frame = 0
        self.frame_count = 0
        self.animation_speed = 100  # 毫秒，控制动画速度
        self.last_update = 0
        
        # 加载 GIF 帧
        self.load_gif_frames(gif_path)
        
    def load_gif_frames(self, gif_path):
        """加载 GIF 的所有帧"""
        try:
            with Image.open(gif_path) as gif:
                self.frame_count = gif.n_frames
                print(f"加载 GIF: {gif_path}")
                print(f"帧数: {self.frame_count}, 尺寸: {gif.size}")
                
                for frame_idx in range(self.frame_count):
                    gif.seek(frame_idx)
                    frame = gif.copy()
                    
                    # 转换为 RGB 模式
                    if frame.mode in ('RGBA', 'LA', 'P'):
                        # 创建黑色背景
                        background = Image.new('RGB', frame.size, (0, 0, 0))
                        if frame.mode == 'P':
                            frame = frame.convert('RGBA')
                        if frame.mode == 'RGBA':
                            background.paste(frame, mask=frame.split()[-1])
                        else:
                            background.paste(frame)
                        frame = background
                    else:
                        frame = frame.convert('RGB')
                    
                    # 调整尺寸以适应屏幕
                    frame = self.resize_frame(frame)
                    
                    # 转换为 pygame Surface
                    frame_str = frame.tobytes()
                    frame_size = frame.size
                    pygame_frame = pygame.image.fromstring(frame_str, frame_size, 'RGB')
                    
                    self.frames.append(pygame_frame)
                    
                print(f"成功加载 {len(self.frames)} 帧")
                
        except Exception as e:
            print(f"加载 GIF 失败: {e}")
            # 创建默认背景
            self.create_default_background()
    
    def resize_frame(self, frame):
        """调整帧尺寸以适应屏幕"""
        img_width, img_height = frame.size
        
        # 计算缩放比例，确保覆盖整个屏幕
        scale_x = self.screen_width / img_width
        scale_y = self.screen_height / img_height
        scale = max(scale_x, scale_y)
        
        new_width = int(img_width * scale)
        new_height = int(img_height * scale)
        
        # 缩放
        resized = frame.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # 居中裁剪
        left = (new_width - self.screen_width) // 2
        top = (new_height - self.screen_height) // 2
        right = left + self.screen_width
        bottom = top + self.screen_height
        
        return resized.crop((left, top, right, bottom))
    
    def create_default_background(self):
        """创建默认背景（当 GIF 加载失败时）"""
        default_bg = pygame.Surface((self.screen_width, self.screen_height))
        default_bg.fill((0, 0, 50))  # 深蓝色背景
        
        # 添加一些星星
        for _ in range(50):
            x = pygame.math.Vector2().random() * self.screen_width
            y = pygame.math.Vector2().random() * self.screen_height
            pygame.draw.circle(default_bg, (255, 255, 255), (int(x), int(y)), 1)
        
        self.frames = [default_bg]
        self.frame_count = 1
    
    def update(self):
        """更新动画帧"""
        current_time = pygame.time.get_ticks()
        if current_time - self.last_update > self.animation_speed:
            self.current_frame = (self.current_frame + 1) % self.frame_count
            self.last_update = current_time
    
    def draw(self, screen):
        """绘制当前帧"""
        if self.frames:
            screen.blit(self.frames[self.current_frame], (0, 0))
    
    def set_animation_speed(self, speed):
        """设置动画速度（毫秒）"""
        self.animation_speed = max(10, speed)  # 最小 10ms
