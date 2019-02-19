FROM adminer:4.7.1

RUN mkdir -p include \
 && curl https://raw.githubusercontent.com/arxeiss/Adminer-FillLoginForm/master/fill-login-form.php > include/plugin-fill-login-form.php
COPY fill-login-form.php plugins-enabled
#RUN php plugin-loader.php "fill-login-form" > plugins-enabled/001-fill-login-form.php
