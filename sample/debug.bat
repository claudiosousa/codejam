@echo off
START /B CMD /C CALL node.exe --debug-brk %1 %2
START /B CMD /C CALL node_modules\.bin\node-inspector
start http://localhost:8080/debug?port=5858
pause