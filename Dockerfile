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

## add permissions for nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && chown -R nginx:nginx /var/run/nginx.pid
USER nginx

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]