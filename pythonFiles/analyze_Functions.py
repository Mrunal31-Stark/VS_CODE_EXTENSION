import ast, os, sys, json

def count_functions_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            tree = ast.parse(f.read(), filename=filepath)
            return sum(isinstance(node, ast.FunctionDef) for node in tree.body)
    except Exception:
        return 0

def scan_directory(folder):
    result = {}
    for root, _, files in os.walk(folder):
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                relpath = os.path.relpath(filepath, folder)
                result[relpath] = count_functions_in_file(filepath)
    return result

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Folder path required"}))
        sys.exit(1)

    target_folder = sys.argv[1]
    output = scan_directory(target_folder)
    print(json.dumps(output))  # ONLY THIS should be printed
