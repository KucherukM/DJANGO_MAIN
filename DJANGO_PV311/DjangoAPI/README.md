py -m venv .venv

.venv\Scripts\activate.bat

pip install django

python.exe -m pip install --upgrade pip

django-admin startproject storeapi

cd storeapi

py manage.py runserver 4097

py manage.py migrate

py manage.py startapp product

python manage.py makemigrations

python manage.py migrate

py manage.py createsuperuser

admin

Qwerty1-

py manage.py runserver 4097

pip install djangorestframework

## Add cors
```
pip install django-cors-headers
```

## Create React App Vite
```
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev

npm i @reduxjs/toolkit react-redux
```

## Install flowbite and Tailwind css
```
npm install tailwindcss @tailwindcss/vite
npm i @heroicons/react @headlessui/react
```

