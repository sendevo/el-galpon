# Despliegue

## Instalación Expo-CLI
```bash
$ npm install --global expo-cli
```

## Instalar dependencias

Si las versiones de package.json son correctas:

```bash
$ expo install
```

Dependencias:

```bash
@react-navigation/native 
@react-navigation/stack 
@react-native-community/masked-view 
react-native-gesture-handler 
react-native-reanimated 
react-native-screens 
expo-sqlite
```

## Iniciar app
```bash
$ expo start
```

## Iniciar emulador android (Linux)
```bash
cd ~/Android/Sdk/emulator
./emulator -avd Pixel_3a_API_30_x86
```


### Agregar path de modulos globales npm a variable de entorno (Linux)
```bash
export PATH=~/.npm-global/bin:$PATH
```




# Notas

Identificador de instalación (para versionado y demás)

```js
import Constants from 'expo-constants';
const id = Constants.installationId;
```
