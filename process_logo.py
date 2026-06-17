from PIL import Image
import os

def process_logo(input_path, output_path, favicon_path=None):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # Simple background removal: convert nearly white pixels to transparent
    for item in datas:
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Logo processed and saved to {output_path}")

    if favicon_path:
        # Generate a clear favicon by resizing and ensuring it's prominent
        favicon_size = (64, 64)
        favicon_img = img.copy()
        favicon_img.thumbnail(favicon_size, Image.Resampling.LANCZOS)
        
        # Create a new image with background if the logo is too light for some browser tabs
        # But usually transparency is better. Let's just ensure high quality resize.
        favicon_img.save(favicon_path, "PNG")
        print(f"Favicon generated and saved to {favicon_path}")

if __name__ == "__main__":
    input_file = "logo.jfif"
    assets_dir = os.path.join("Edvantage", "frontend", "src", "assets")
    public_dir = os.path.join("Edvantage", "frontend", "public")
    
    os.makedirs(assets_dir, exist_ok=True)
    os.makedirs(public_dir, exist_ok=True)
    
    output_file = os.path.join(assets_dir, "logo.png")
    favicon_file = os.path.join(public_dir, "favicon.png")
    
    if os.path.exists(input_file):
        process_logo(input_file, output_file, favicon_file)
    else:
        print(f"Error: {input_file} not found.")
