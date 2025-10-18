var map = L.map('map').setView([10.762622, 106.660172], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    map.setView([lat, lon], 13);
    L.marker([lat, lon]).addTo(map).bindPopup("Bạn ở đây!").openPopup();
}, function(error) {
    console.error("Lỗi lấy vị trí: ", error);
});

// Tạo nút định vị
var locateControl = L.control({position: 'topright'});

locateControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    div.style.backgroundColor = 'white';
    div.style.width = '30px';
    div.style.height = '30px';
    div.style.cursor = 'pointer';
    div.style.textAlign = 'center';
    div.style.lineHeight = '30px';
    div.title = "Định vị vị trí hiện tại";
    div.innerHTML = '📍';

    div.onclick = function(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;

                map.setView([lat, lon], 16);
                L.marker([lat, lon]).addTo(map).bindPopup("Bạn ở đây!").openPopup();
            }, function(){
                alert("Không thể xác định vị trí hiện tại.");
            });
        } else {
            alert("Trình duyệt không hỗ trợ định vị.");
        }
    }
    return div;
};

locateControl.addTo(map);

// Địa điểm đích ví dụ, bạn có thể lấy từ input
var destination = [10.776889, 106.700806]; // Thay bằng tọa độ đích

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        // Khởi tạo routing control
        L.Routing.control({
            waypoints: [
                L.latLng(lat, lon),  // Vị trí người dùng
                L.latLng(destination[0], destination[1])  // Vị trí đích
            ],
            routeWhileDragging: true
        }).addTo(map);
    }, function(){
        alert("Không thể lấy vị trí hiện tại để định tuyến.");
    });
}
// Xử lý nút định vị
document.getElementById('locateBtn').onclick = function() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            map.setView([lat, lon], 16);
            L.marker([lat, lon]).addTo(map).bindPopup("Bạn ở đây!").openPopup();
        }, function(){
            alert("Không thể xác định vị trí hiện tại.");
        });
    } else {
        alert("Trình duyệt không hỗ trợ định vị.");
    }
}

// Xử lý tìm kiếm địa điểm (giả lập bằng tọa độ, muốn dùng địa chỉ thì cần API geocode)
document.getElementById('searchInput').onkeydown = function(e) {
    if(e.key == "Enter") {
        var value = document.getElementById('searchInput').value;
        // Ở đây ví dụ: nhập "Bờ Hồ Tràm" thì sẽ đến một tọa độ mẫu
        var destLat = 10.541285; // Thay bằng giá trị thực tế khi dùng API geocode
        var destLon = 107.392827;
        map.setView([destLat, destLon], 16);
        L.marker([destLat, destLon]).addTo(map).bindPopup("Địa điểm bạn tìm!").openPopup();
    }
}

// Xử lý nút tìm đường (routeBtn) nếu bạn tích hợp leaflet-routing-machine như phần hướng dẫn trước
