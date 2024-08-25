import json
import os
import shutil
import subprocess

def run_command(command):
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    output, error = process.communicate()
    return output.decode('utf-8'), error.decode('utf-8')

def git_pull():
    print("Pulling latest changes...")
    output, error = run_command("git pull")
    if error:
        print(f"Error pulling changes: {error}")
        exit(1)
    print("Pull successful.")

def update_items_json(new_item):
    with open('content/items.json', 'r') as f:
        data = json.load(f)
    
    data['items'].append(new_item)
    
    with open('content/items.json', 'w') as f:
        json.dump(data, f, indent=2)

def create_image_directory(dir_name):
    os.makedirs(os.path.join('content', dir_name), exist_ok=True)

def copy_images(src_dir, dest_dir):
    src_path = os.path.expanduser(os.path.join('content', src_dir))
    dest_path = os.path.join('content', dest_dir)
    
    if not os.path.exists(src_path):
        print(f"Source directory {src_path} does not exist.")
        return
    
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    counter = 1
    
    for filename in os.listdir(src_path):
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            src_file = os.path.join(src_path, filename)
            _, ext = os.path.splitext(filename)
            dest_file = os.path.join(dest_path, f"{counter}{ext.lower()}")
            shutil.copy2(src_file, dest_file)
            counter += 1
    
    print(f"Copied {counter - 1} images to {dest_path}")

def git_commit(item_name):
    print("Committing changes...")
    run_command("git add content/")
    output, error = run_command(f'git commit -m "Added item {item_name}"')
    if error and "nothing to commit" not in error:
        print(f"Error committing changes: {error}")
        exit(1)
    print("Changes committed successfully.")

def main():
    git_pull()
    
    name_en = input("Enter item name in English: ")
    name_es = input("Enter item name in Spanish: ")
    desc_en = input("Enter description in English: ")
    desc_es = input("Enter description in Spanish: ")
    price = float(input("Enter price: "))
    image_dir = input("Enter image directory name: ")
    existing_dir = input("Enter existing image directory (optional, press Enter to skip): ")
    
    new_item = {
        "name": {"en": name_en, "es": name_es},
        "description": {"en": desc_en, "es": desc_es},
        "price": price,
        "imageDir": image_dir
    }
    
    update_items_json(new_item)
    create_image_directory(image_dir)
    
    if existing_dir:
        copy_images(existing_dir, image_dir)
    
    git_commit(name_en)

if __name__ == "__main__":
    main()
