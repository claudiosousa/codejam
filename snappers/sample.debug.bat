@echo off
START /B CMD /C CALL bin\node --debug-brk script.js sample.in
cd bin
START /B CMD /C CALL node_modules\.bin\node-inspector
start http://localhost:8080/debug?port=5858
pause