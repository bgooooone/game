#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SVG 转 PNG 工具
将 SVG 文件转换为 PNG 图片
"""

import os
import subprocess
import sys

def install_cairo():
    """安装 Cairo（Windows）"""
    try:
        # 尝试使用 conda 安装
        subprocess.run([sys.executable, "-m", "pip", "install", "pycairo"], check=True)
        print("Cairo 安装成功")
        return True
    except:
        print("Cairo 安装失败，将使用备用方案")
        return False

def svg_to_png_with_inkscape(svg_path, png_path, width, height):
    """使用 Inkscape 转换 SVG 到 PNG"""
    try:
        cmd = [
            "inkscape",
            "--export-type=png",
            f"--export-filename={png_path}",
            f"--export-width={width}",
            f"--export-height={height}",
            svg_path
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"使用 Inkscape 转换成功: {png_path}")
        return True
    except:
        return False

def create_simple_png_background(width, height, output_path):
    """创建简单的 PNG 背景（备用方案）"""
    try:
        from PIL import Image, ImageDraw
        
        # 创建深空背景
        img = Image.new('RGB', (width, height), (26, 26, 46))
        draw = ImageDraw.Draw(img)
        
        # 添加渐变效果
        for y in range(height):
            ratio = y / height
            r = int(26 * (1 - ratio * 0.5))
            g = int(26 * (1 - ratio * 0.5))
            b = int(46 * (1 - ratio * 0.3))
            draw.line([(0, y), (width, y)], fill=(r, g, b))
        
        # 添加星星
        import random
        random.seed(42)
        for _ in range(100):
            x = random.randint(0, width)
            y = random.randint(0, height)
            brightness = random.randint(100, 255)
            size = random.randint(1, 3)
            draw.ellipse([x-size, y-size, x+size, y+size], fill=(brightness, brightness, brightness))
        
        # 添加一些彩色星云
        for _ in range(5):
            x = random.randint(50, width-50)
            y = random.randint(50, height-50)
            colors = [(106, 90, 205), (255, 105, 180), (0, 191, 255), (255, 215, 0)]
            color = random.choice(colors)
            size = random.randint(30, 80)
            draw.ellipse([x-size, y-size, x+size, y+size//2], fill=color + (50,))
        
        img.save(output_path, 'PNG')
        print(f"创建简单背景成功: {output_path}")
        return True
        
    except Exception as e:
        print(f"创建背景失败: {e}")
        return False

def convert_svg_to_png(svg_path, png_path, width=480, height=720):
    """转换 SVG 到 PNG"""
    
    # 方法1: 尝试使用 Inkscape
    if svg_to_png_with_inkscape(svg_path, png_path, width, height):
        return True
    
    # 方法2: 尝试安装并导入 cairo
    if install_cairo():
        try:
            import cairo
            import cairosvg
            
            # 使用 cairosvg 转换
            cairosvg.svg2png(url=svg_path, write_to=png_path, output_width=width, output_height=height)
            print(f"使用 cairosvg 转换成功: {png_path}")
            return True
        except Exception as e:
            print(f"cairosvg 转换失败: {e}")
    
    # 方法3: 创建简单背景
    print("使用备用方案：创建简单背景")
    return create_simple_png_background(width, height, png_path)

if __name__ == "__main__":
    svg_path = "assets/images/plane_war_background.svg"
    png_path = "assets/images/plane_war_background.png"
    
    if os.path.exists(svg_path):
        convert_svg_to_png(svg_path, png_path)
    else:
        print(f"SVG 文件不存在: {svg_path}")
        create_simple_png_background(480, 720, png_path)

