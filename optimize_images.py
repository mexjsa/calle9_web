import os
import sys
from pathlib import Path
try:
    from PIL import Image
except ImportError:
    import subprocess
    print("Pillow not found, installing...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

MAX_SIZE = (1920, 1920)
QUALITY = 80

def optimize_image(filepath):
    original_size = os.path.getsize(filepath)
    try:
        with Image.open(filepath) as img:
            # Skip GIF, as PIL might lose animation or get confused
            if img.format == 'GIF':
                return
            
            # Convert to RGB if RGBA and saving as JPEG
            # Actually, let's keep the existing format or save as WebP / optimize current format
            img_format = img.format if img.format else filepath.suffix[1:].upper()
            if img_format == 'JPG':
                img_format = 'JPEG'
                
            # Resize if necessary
            img.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
            
            # For JPEGs we can optimize and reduce quality
            save_kwargs = {}
            if img_format in ['JPEG', 'MPO']:
                save_kwargs = {'quality': QUALITY, 'optimize': True}
                if img.mode != 'RGB':
                    img = img.convert('RGB')
            elif img_format == 'PNG':
                save_kwargs = {'optimize': True}
                
            # Save to a temporary file
            temp_path = filepath.with_name(filepath.stem + "_temp" + filepath.suffix)
            img.save(temp_path, format=img.format if img.format else "JPEG", **save_kwargs)
            
            new_size = os.path.getsize(temp_path)
            
            # If the new file is smaller, replace the old one
            if new_size < original_size:
                temp_path.replace(filepath)
                print(f"Optimized {filepath.name}: {original_size / 1024 / 1024:.2f} MB -> {new_size / 1024 / 1024:.2f} MB")
            else:
                temp_path.unlink()
                print(f"Skipped {filepath.name}: already optimized")
                
    except Exception as e:
        print(f"Failed to process {filepath.name}: {e}")

if __name__ == "__main__":
    assets_dir = Path("c:/Users/Juan/.gemini/antigravity/scratch/calle9_web/assets")
    extensions = {'.jpg', '.jpeg', '.png', '.webp'}
    total_original_size = 0
    total_new_size = 0
    
    print("Scanning for images...")
    images_to_process = []
    for filepath in assets_dir.rglob("*"):
        if filepath.suffix.lower() in extensions:
            images_to_process.append(filepath)
            total_original_size += os.path.getsize(filepath)
            
    print(f"Found {len(images_to_process)} images to optimize.")
    
    for count, filepath in enumerate(images_to_process, 1):
        print(f"[{count}/{len(images_to_process)}] Processing {filepath.name}...")
        optimize_image(filepath)
        
    for filepath in assets_dir.rglob("*"):
         if filepath.suffix.lower() in extensions:
            total_new_size += os.path.getsize(filepath)
            
    print(f"\nOptimization complete!")
    print(f"Total size before: {total_original_size / 1024 / 1024:.2f} MB")
    print(f"Total size after:  {total_new_size / 1024 / 1024:.2f} MB")
    print(f"Saved: {(total_original_size - total_new_size) / 1024 / 1024:.2f} MB")
