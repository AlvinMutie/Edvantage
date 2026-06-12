from PIL import Image
import os

def process_logo(input_path, output_path):
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

if __name__ == "__main__":
    input_file = "logo.jfif"
    output_dir = os.path.join("Edvantage", "frontend", "src", "assets")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "logo.png")
    
    if os.path.exists(input_file):
        process_logo(input_file, output_file)
        print(f"Logo processed and saved to {output_file}")
    else:
        print(f"Error: {input_file} not found.")
