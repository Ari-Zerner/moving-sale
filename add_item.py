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

def check_and_rename_images(dir_name):
    dir_path = os.path.join('content', dir_name)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        print(f"Created empty directory: {dir_path}")
        return
    
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    existing_files = [f for f in os.listdir(dir_path) if any(f.lower().endswith(ext) for ext in image_extensions)]
    existing_files.sort()
    
    for i, filename in enumerate(existing_files, start=1):
        old_path = os.path.join(dir_path, filename)
        _, ext = os.path.splitext(filename)
        new_filename = f"{i}{ext.lower()}"
        new_path = os.path.join(dir_path, new_filename)
        
        if filename != new_filename:
            os.rename(old_path, new_path)
    
    print(f"Checked and renamed {len(existing_files)} images in {dir_path}")

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
    desc_en = input("Enter description in English: ").replace("\\n", "\n")
    desc_es = input("Enter description in Spanish: ").replace("\\n", "\n")
    price = int(input("Enter price: "))
    image_dir = input("Enter image directory name: ")
    
    new_item = {
        "name": {"en": name_en, "es": name_es},
        "description": {"en": desc_en, "es": desc_es},
        "price": price,
        "imageDir": image_dir
    }
    
    update_items_json(new_item)
    check_and_rename_images(image_dir)
    
    git_commit(name_en)

if __name__ == "__main__":
    main()
