FROM 721728311103.dkr.ecr.eu-west-1.amazonaws.com/oliverstore/webapp
MAINTAINER OliverStore <informatique@oliverstore.com>


# Image blueprint
ARG OSTORE_IMAGE_NAME=prodoo
ARG OSTORE_IMAGE_VERSION=latest

# Add app structure
ADD ./dist/ $OSTORE_APP

WORKDIR ${OSTORE_ANSIBLE}
RUN ssh-agent bash \
      -c 'ssh-add ${OSTORE_KEYS}/${OSTORE_IMAGE_GIT_SSH_KEYNAME} \
            && git clone  --branch ${OSTORE_IMAGE_NAME} --single-branch ${OSTORE_IMAGE_GIT_SSH_REPO_URL}  tmp-repo \
            && cp -r tmp-repo/* . \
            && rm -rf tmp-repo'

RUN ansible-playbook main.yml

CMD ["nginx", "-g", "daemon off;"]

WORKDIR $OSTORE_APP
