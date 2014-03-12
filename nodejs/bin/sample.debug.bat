@echo off
START /B CMD /C CALL node --debug-brk ..\template\script.js ..\template\sample.in
START /B CMD /C CALL node_modules\.bin\node-inspector
start http://localhost:8080/debug?port=5858
pause