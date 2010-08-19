@echo off
SET PATH=%PATH%;C:\WINDOWS\Microsoft.NET\Framework\V3.5;

if not exist output ( mkdir output )

echo Compiling
msbuild /nologo /verbosity:quiet src/Mvc.TaskUI.sln /p:Configuration=Release /t:Clean
msbuild /nologo /verbosity:quiet src/Mvc.TaskUI.sln /p:Configuration=Release

echo Copying
copy src\proj\Mvc.TaskUI\bin\Release\*.* output\

echo Minifying
.\bin\ajaxmin-bin\ajaxmin.exe -clobber:true -term -literals:combine src\proj\Mvc.TaskUI\jquery.hijax.js -out output\jquery.hijax.min.js

echo Cleaning
msbuild /nologo /verbosity:quiet src/Mvc.TaskUI.sln /p:Configuration=Release /t:Clean

echo Done