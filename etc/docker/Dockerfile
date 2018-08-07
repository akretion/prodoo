FROM 721728311103.dkr.ecr.eu-west-1.amazonaws.com/oliverstore/node:0.2.0
MAINTAINER OliverStore <informatique@oliverstore.com>

WORKDIR /os/build
COPY target/app.tar.gz /os/build/
RUN tar zxvf /os/build/app.tar.gz
RUN rm /os/build/app.tar.gz
RUN cp -r /os/build/* /os/app/

WORKDIR /os/app/
CMD npm start