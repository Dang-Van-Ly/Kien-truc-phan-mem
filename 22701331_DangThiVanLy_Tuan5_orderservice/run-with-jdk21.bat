@echo off
set "JAVA_HOME=C:\Java\jdk-21.0.7\jdk-21.0.7"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0"
call "%~dp0mvnw.cmd" spring-boot:run
