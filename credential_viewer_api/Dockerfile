# Use the official PHP image as the base image
FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    nginx \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set the working directory
WORKDIR /var/www/html

# Copy the application files to the container
COPY . .

# Install Laravel dependencies
RUN composer install --no-interaction --no-plugins --no-scripts --prefer-dist

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose port 80
EXPOSE 80

# Start PHP-FPM and Nginx
CMD service p8.2-fpm start && nginx -g "daemon off;"
