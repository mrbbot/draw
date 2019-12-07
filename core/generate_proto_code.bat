protoc -I=. --java_out=../src/main/java/ --js_out=import_style=commonjs,binary:../web/src/socket/ ./draw.proto
