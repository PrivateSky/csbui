FROM ubuntu:latest

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install apt-utils git wget curl -y

RUN apt-get -y install npm
RUN wget -qO- https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get upgrade -y && \
    apt-get -y install nodejs

RUN mkdir workspace

RUN git clone https://github.com/PrivateSky/privatesky.git workspace/privatesky

RUN git clone -b 3dt https://github.com/PrivateSky/csbui.git workspace/csbui
RUN cd workspace/csbui/csb-hybrid-app && \
    npm install && \
    mkdir public/apps/csb/scripts

RUN cd workspace/privatesky && \
    npm run install && \
    node ./bin/scripts/pskbuild.js ./builds/build.json --output="../csbui/csb-hybrid-app/public/apps/csb/scripts"

RUN cd workspace/privatesky && echo './bin/virtualMq.sh --port=8080 --folder="../tmp" & \n cd ../csbui/csb-hybrid-app/ && npm run start-web' >> startup-script.sh
RUN cd workspace/privatesky && cat startup-script.sh

EXPOSE 8080/tcp 3000/tcp

CMD cd workspace/privatesky && \
    bash startup-script.sh
	
