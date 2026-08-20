import requests

r = requests.get('http://localhost:8000/api/inventory/pizzas/?limit=5')
if r.status_code == 200:
    data = r.json()
    for item in data.get('results', []):
        print(f"Product: {item.get('name')}")
        print(f"  image: {item.get('image')[:60] if item.get('image') else 'None'}")
        print(f"  image_url: {item.get('image_url')[:60] if item.get('image_url') else 'None'}")
        print()
else:
    print(f"Error: {r.status_code}")
    print(r.text[:500])
