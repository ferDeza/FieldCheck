FROM ubuntu:latest
LABEL authors="Fernando"

ENTRYPOINT ["top", "-b"]