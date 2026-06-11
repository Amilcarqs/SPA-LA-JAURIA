
{
  "email": "admin1@petspa.com",
  "password": "Admin123!",
  "role": "ADMIN"
}


{
  "email": "recepcion@example.com",
  "password": "Recep123!",
  "role": "RECEPTIONIST"
}



admin1@petspa.com
Admin123!

recepcion@example.com
Recep123!

amilcar@gmail.com
Amilcar.2

cliente2@petspa.com
Cliente.2


# ADICIONAR USUARIOS:
Flujo exacto:

Haz login normal
Método: POST
URL: http://localhost:3000/auth/login
Body:
{
  "email": "tu@email.com",
  "password": "tuPassword"
}
Si la cuenta tiene 2FA activado, la respuesta será algo así:
{
  "requires2FA": true,
  "email": "tu@email.com"
}
Entonces debes enviar el código de 6 dígitos del autenticador
Método: POST
URL: http://localhost:3000/auth/2fa/verify-login
Body:
{
  "email": "admin1@petspa.com",
  "token": "123456"
}
Si el código es correcto, recibirás el token:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

lUEGO CON POST EN:
agregando en Auth el token del admin

http://localhost:3000/auth/create-staff

{
  "name": "Lucía Torres",
  "email": "groomer1@petspa.com",
  "password": "Groomer.1.",
  "role": "GROOMER",
  "staffType": "GROOMER",
  "specialty": "Corte y baño",
  "shift": "Mañana",
  "phone": "987654321"
}
{
  "name": "Bruno Mena",
  "email": "groomer2@petspa.com",
  "password": "Groomer.2.",
  "role": "GROOMER",
  "staffType": "GROOMER",
  "specialty": "Peluquería premium",
  "shift": "Tarde",
  "phone": "987654322"
}
{
  "name": "Sofía Vega",
  "email": "groomer3@petspa.com",
  "password": "Groomer.3.",
  "role": "GROOMER",
  "staffType": "GROOMER",
  "specialty": "Baños y deslanado",
  "shift": "Noche",
  "phone": "987654323"
}
---
{
  "name": "Daniela Cruz",
  "email": "recepcionista1@petspa.com",
  "password": "Recepcionista.1.",
  "role": "RECEPTIONIST",
  "staffType": "RECEPTIONIST",
  "specialty": "Atención al cliente",
  "shift": "Mañana",
  "phone": "987654324"
}
{
  "name": "Mateo Ruiz",
  "email": "recepcionista2@petspa.com",
  "password": "Recepcionista.2.",
  "role": "RECEPTIONIST",
  "staffType": "RECEPTIONIST",
  "specialty": "Reservas y citas",
  "shift": "Tarde",
  "phone": "987654325"
}

{
  "name": "Camila Ortega",
  "email": "recepcionista3@petspa.com",
  "password": "Recepcionista.3.",
  "role": "RECEPTIONIST",
  "staffType": "RECEPTIONIST",
  "specialty": "Control de ingreso",
  "shift": "Noche",
  "phone": "987654326"
}