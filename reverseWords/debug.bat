@echo off
START /B CMD /C CALL node.exe --debug-brk storeCredit.js A-small-practice.in
START /B CMD /C CALL node-inspector
sleep 1
start http://localhost:8080/debug?port=5858
pause