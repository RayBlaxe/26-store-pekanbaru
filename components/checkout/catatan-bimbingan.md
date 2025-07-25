~~ - login success didnt directly redirect to home page ~~
- the customer when not logged in yet, the navbar should not show the cart icon, "Keranjang" text, "Pesanan" text, and "Profil" text
- Change the "Beli" button to "Masukkan ke Keranjang" button
- Fix order status didnt change to "Diproses" after payment success
- add another role for superadmin, able to see sales report and manage admin users
- for admin role should be able to manage products, manage orders, and manage users
- rajaongkir integration for shipping cost
- Profile page should show the user's name, email, and phone number
- Add customer addresses management for shipping cost calculation
- fix dashboard page not showing the correct data for the backend
- fix filter for products by category and price range (search already works)
   


- Count the shipping cost based on the selected address and destination city and show the shipping cost in the checkout page complete with selected courier and service based on the response from RajaOngkir API

for 'RAJAONGKIR_API_KEY' = 'wkVZsq4Ka786ab6b3b02c1e1dHNLygo8' put in environment variable
POST https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost
with body example:
```json
{
  "origin": "28127", //<- 26 store pekanbaru postal code
  "destination": "17421", //<- destination postal code
  "weight": "1000", //<- weight in grams
  "courier": "jne", //<- courier code for 26 store pekanbaru, you can use "jne" only for now
  "price": "lowest" //<- sorting price from lowest to highest
}
```
headers:
```json
{
  "key": "{{RAJAONGKIR_API_KEY}}",
  "Content-Type": "application/www-form-urlencoded"
}
```

response example:
```json
{
    "meta": {
        "message": "Success Calculate Domestic Shipping cost",
        "code": 200,
        "status": "success"
    },
    "data": [
        {
            "name": "Jalur Nugraha Ekakurir (JNE)",
            "code": "jne",
            "service": "REG",
            "description": "Layanan Reguler",
            "cost": 18000,
            "etd": "6 day"
        },
        {
            "name": "Jalur Nugraha Ekakurir (JNE)",
            "code": "jne",
            "service": "JTR",
            "description": "JNE Trucking",
            "cost": 90000,
            "etd": "5 day"
        },
        {
            "name": "Jalur Nugraha Ekakurir (JNE)",
            "code": "jne",
            "service": "JTR<130",
            "description": "JNE Trucking",
            "cost": 200000,
            "etd": "5 day"
        },
        {
            "name": "Jalur Nugraha Ekakurir (JNE)",
            "code": "jne",
            "service": "JTR>130",
            "description": "JNE Trucking",
            "cost": 600000,
            "etd": "5 day"
        },
        {
            "name": "Jalur Nugraha Ekakurir (JNE)",
            "code": "jne",
            "service": "JTR>200",
            "description": "JNE Trucking",
            "cost": 900000,
            "etd": "5 day"
        }
    ]
}
```

- And for search a address to count the shipping cost, you can use this endpoint:
GET https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=kebon kelapa&limit=10&offset=0
with headers
```json
{
  "key": "{{RAJAONGKIR_API_KEY}}",
  
}
```

