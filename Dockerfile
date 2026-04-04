# Usamos Nginx ligero como servidor web rápido para archivos estáticos
FROM nginx:alpine

# Copiamos todos los archivos de tu proyecto (html, css, js) al servidor web
COPY . /usr/share/nginx/html

# Exponer el puerto por el que escuchará el contenedor (Easypanel lo detectará)
EXPOSE 80
