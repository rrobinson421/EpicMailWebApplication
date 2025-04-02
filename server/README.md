Creating your own virtual environemnt
Windows:
```
python -m venv <env_name>
```
macOS:
```
python3 -m venv <env_name>
```
(env_name is generally set to venv)

Running your virtual environment
Windows:
```
cd server
.\.<env_name>\Scripts\activate
```
macOS:
```
cd <env_name>
source .<env_name>/bin/activate
```

Installing Flask in venv
```
pip install -r /path/to/requirements.txt
```