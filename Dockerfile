FROM nginx:1.19.7-alpine

# Set default port
EXPOSE 8080

# Copy application code
COPY ./build /usr/share/nginx/html

# Copy nginx config
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY ./conf/gzip.conf /etc/nginx/conf.d/gzip.conf

# Initialize environment variables into filesystem
WORKDIR /usr/share/nginx/html
COPY ./conf/env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Run script which initializes env vars to fs
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]