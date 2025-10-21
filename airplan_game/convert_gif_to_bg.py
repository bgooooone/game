#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GIF 转背景图片工具
将 GIF 文件转换为适合飞机大战的背景图片
"""

import os
from PIL import Image

def convert_gif_to_background():
    """将 GIF 转换为背景图片"""
    
    # 文件路径
    gif_path = os.path.join('assets', 'images', 'preview.gif')
    output_path = os.path.join('assets', 'images', 'space_background.png')
    
    # 游戏屏幕尺寸
    GAME_WIDTH, GAME_HEIGHT = 480, 720
    
    try:
        # 打开 GIF 文件
        with Image.open(gif_path) as gif:
            print(f"GIF 信息: {gif.size}, 帧数: {gif.n_frames}")
            
            # 获取第一帧
            gif.seek(0)
            first_frame = gif.copy()
            
            # 转换为 RGB 模式（去除透明度）
            if first_frame.mode in ('RGBA', 'LA', 'P'):
                # 创建白色背景
                background = Image.new('RGB', first_frame.size, (0, 0, 0))  # 黑色背景
                if first_frame.mode == 'P':
                    first_frame = first_frame.convert('RGBA')
                background.paste(first_frame, mask=first_frame.split()[-1] if first_frame.mode == 'RGBA' else None)
                first_frame = background
            else:
                first_frame = first_frame.convert('RGB')
            
            # 调整尺寸以适应游戏屏幕
            # 保持宽高比，但确保至少覆盖游戏区域
            img_width, img_height = first_frame.size
            
            # 计算缩放比例，确保图片能覆盖整个游戏区域
            scale_x = GAME_WIDTH / img_width
            scale_y = GAME_HEIGHT / img_height
            scale = max(scale_x, scale_y)  # 使用较大的缩放比例
            
            new_width = int(img_width * scale)
            new_height = int(img_height * scale)
            
            # 缩放图片
            resized = first_frame.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # 裁剪到游戏尺寸（从中心裁剪）
            left = (new_width - GAME_WIDTH) // 2
            top = (new_height - GAME_HEIGHT) // 2
            right = left + GAME_WIDTH
            bottom = top + GAME_HEIGHT
            
            final_bg = resized.crop((left, top, right, bottom))
            
            # 保存为 PNG
            final_bg.save(output_path, 'PNG')
            print(f"背景图片已保存: {output_path}")
            print(f"最终尺寸: {final_bg.size}")
            
            return True
            
    except Exception as e:
        print(f"转换失败: {e}")
        return False

if __name__ == "__main__":
    convert_gif_to_background()
