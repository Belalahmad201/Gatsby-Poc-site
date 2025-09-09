This Project is about fetching weather data analysis using API API is providing weather data for integration apps Use Cases: Integrate weather in mobile or web app displaying conditions, forecast notifying users of weather events. import requests

API_KEY = 'your_openweathermap_api_key' city = 'Mumbai'

url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric' response = requests.get(url)

if response.status_code == 200: data = response.json() print(f"Weather in {city}: {data['weather'][0]['description']}") print(f"Temperature: {data['main']['temp']}°C") print(f"Humidity: {data['main']['humidity']}%") else: print("Error fetching data")
