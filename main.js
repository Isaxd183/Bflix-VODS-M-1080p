var page = require('movian/page');
var service = require('movian/service');
var http = require('movian/http');
var plugin = JSON.parse(Plugin.manifest);

var BASE_URL = "http://144.217.70.79/VODS-M/1080P/";
var ICON_PATH = Plugin.path + plugin.icon;
var BG_PATH = Plugin.path + "bg.png";
var VODS_ID = plugin.id;

service.create(plugin.title, VODS_ID + ":start", 'video', true, ICON_PATH);

function establecerCabeceraPagina(pagina, titulo) {
    pagina.metadata.title = titulo;
    pagina.metadata.logo = ICON_PATH;
    pagina.metadata.background = BG_PATH;
    pagina.metadata.icon = ICON_PATH;
    pagina.type = "directory";
    pagina.contents = "items";
    pagina.loading = true;
}

new page.Route(VODS_ID + ":start", function (pagina) {
    establecerCabeceraPagina(pagina, "Bflix VODS 1080P - Lista de Películas");
    pagina.model.contents = 'list';

    try {
        var response = http.request(BASE_URL);
        var html = response.toString();
        
        var regex = /<a\s+href="([^"]+\.(?:mkv|mp4|avi|webm|mov))"[^>]*>([^<]+)<\/a>/gi;
        var match;

        while ((match = regex.exec(html)) !== null) {
            var file_path_encoded = match[1]; 
            var title_clean = match[2];       
            
            var videoURL = BASE_URL + file_path_encoded;

            var cleanTitle = title_clean
                .replace(/\.(mkv|mp4|avi|webm|mov)$/i, '')
                .trim();
            
            pagina.appendItem(videoURL, "video", {
                title: cleanTitle,
                description: "URL de reproducción: " + videoURL,
                icon: ICON_PATH
            });
        }
        
    } catch (e) {
        pagina.appendItem('', 'separator', { title: 'Error al obtener datos de VODS: ' + e });
    }

    pagina.loading = false;
});