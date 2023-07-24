import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from '../../services/data.service';
import { finalize } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import baseUrl from "../../../BaseUrl";
declare const google: any;
@Component({
  selector: "app-earth-map",
  templateUrl: "./earth-map.component.html",
  styleUrls: ["./earth-map.component.scss"],
})
export class EarthMapComponent implements OnInit {
  lat = 25.5937;
  lng = 78.9629;
  zoom=5;
  pointList: { lat: number; lng: number }[] = [];
  drawingManager: any;
  selectedShape: any;
  selectedArea = 0;
  maps: any;
  public selectedContract: any;
  public loading = true;
  selectedMarker: { lat: any; lng: any } = null;
  markers = [
    { lat: 0, lng: 0, icon: "", _id: -1 ,data:{}},
  ];
  createLat: any;
  createLng: any;
  public baseurlip = baseUrl;
  openPopUp: boolean = false;
  bitoroPrice: any;
  public pathways:any=[];
  shapeSelected: boolean =false;
  
  constructor(private router: Router,public dataService: DataService,private route: ActivatedRoute, public sanitized: DomSanitizer) {}

  ngOnInit() {
    // this.paths =
      
  
      this.route.queryParams
      .subscribe(params => {
        if(params.lat && params.lng){
          this.lat= parseFloat(params.lat);
          this.lng=parseFloat(params.lng)
          this.zoom=15
        }
        this.addMarker(this.lat,this.lng)
       if(params.lat && params.lng){
        this.openPopUp=true;
       }
        this.getPurchaseTransaction()
      }
    )

    this.dataService.getGoldPrice().subscribe((data: any) => {
      this.bitoroPrice = data.goldprice;
      // this.btcPrice = data.btcprice;
      // this.bitorobtc = data.bitorobtc;
    },
      error => {
        console.log(error);
      }
    );

    this.dataService.getMapCoordinates().subscribe(
      (data: any) => {
      data.map((item:any)=>{this.pathways.push(item.coordinates);
        if(item.coordinates[0].lat && item.coordinates[0].lng){this.addNewMarkers(item.coordinates[0].lat,item.coordinates[0].lng,0,item)}})
    })
      
 
  }

  public showDetails(contract: any) {
    this.selectedContract = contract;
  }

  amountEuro(coin:any) {
    return (this.bitoroPrice *coin).toFixed(2);
  }

  onMapReady(map: any) {
    // To hide:
    if (map) {
      this.initDrawingManager(map);
      this.drawingManager.setDrawingMode(null);
      map.setOptions({
        streetViewControl: false,
        fullscreenControl: true,
      });
    }
    else{
      location.reload()
    }
  }

  addMarker(lat: any, lng: any) {
    localStorage.removeItem("selectedLand")
    this.createLat=lat
    this.createLng=lng
    this.markers.push({
      lat,
      lng,
      icon: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|4286f4",
      _id: -1,
      data:{}
    });
  }

  addNewMarkers(lat: any, lng: any, id:any ,data: any) {
    this.createLat=lat
    this.createLng=lng
    this.markers.push({
      lat,
      lng,
      icon: "",
      _id: id,
      data:{data}
    });
    this.shapeSelected = true;
  }

  removeShape(){
    this.shapeSelected = false;
    this.deleteSelectedShape()
  this.removeLandMarker()


  }
  removeLandMarker(){
    let i:any;
    for(i=0 ;i<this.markers.length;i++){
      if (this.markers[i]._id==-2) { 
        this.markers.splice(i, 1);
      }
    }
    localStorage.removeItem("selectedLand")

  }

  removeMarker(){
    let i:any;
    for(i=0 ;i<this.markers.length;i++){
      if (this.markers[i].lat===this.selectedMarker.lat && this.markers[i].lng===this.selectedMarker.lng) { 
        this.markers.splice(i, 1);
      }
    }
  }

  redirectToBuyContract(id:any){
    this.router.navigate(["buy-contract"],{queryParams: {_id:id}});
  }


  clickMe(event: any) {
    this.router.navigate(["buy-contract"]);
  }

  buyNow(event: any) {
    localStorage.setItem("createCoords",JSON.stringify({lat:this.createLat,lng:this.createLng}))
    this.router.navigate(["map-contract"]);
  }

  connect(event: any) {
    window.open("https://meet.google.com/", "_blank");
  }

  getPurchaseTransaction() {
    this.loading = true;
    this.dataService.getAllTradeContracts().pipe((finalize(() => { this.loading = false }))).subscribe(
      (data: any) => {
        this.markers=data.transactions
      },
      (error: any) => {
      }
    )
  }

  pdfExtmatch(image: any) {
    if (image.match(/.pdf$/i)) {
      return false;
    } else {
      return true;
    }
  }


  max(coordType: "lat" | "lng"): number {
    return Math.max(...this.markers.map((marker) => marker[coordType]));
  }

  min(coordType: "lat" | "lng"): number {
    return Math.min(...this.markers.map((marker) => marker[coordType]));
  }

  selectMarker(event: any, marker: any) {

    // this.deleteSelectedShape()
    
    if(event.latitude && event.longitude){
      this.selectedMarker = {
        lat: event.latitude,
        lng: event.longitude,
      };
    } else{
      this.addMarker(event.coords.lat, event.coords.lng);
      this.selectedMarker = {
        lat: event.coords.lat,
        lng: event.coords.lng,
      };
    }
  }

  initDrawingManager = (map: any) => {
    const self = this;
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["polygon"],
      },
      polygonOptions: {
        draggable: false,
        editable: true,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(this.drawingManager, "overlaycomplete", (event: any) => {
    
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        const paths = event.overlay.getPaths();
        for (let p = 0; p < paths.getLength(); p++) {
          google.maps.event.addListener(paths.getAt(p), "set_at", () => {
            if (!event.overlay.drag) {
              self.updatePointList(event.overlay.getPath());
            }
          });
          google.maps.event.addListener(paths.getAt(p), "insert_at", () => {
            self.updatePointList(event.overlay.getPath());
          });
          google.maps.event.addListener(paths.getAt(p), "remove_at", () => {
            self.updatePointList(event.overlay.getPath());
          });
        }
        self.updatePointList(event.overlay.getPath());
        this.selectedShape = event.overlay;
        this.selectedShape.type = event.type;
      }
      if (event.type !== google.maps.drawing.OverlayType.MARKER) {
        // Switch back to non-drawing mode after drawing a shape.
        self.drawingManager.setDrawingMode(null);
        // self.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
        // To hide:
        self.drawingManager.setOptions({
          drawingControl: true,
        });
      }
      else {
        self.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      }
    });
  };

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      this.pointList = [];
      // To show:
      this.drawingManager.setOptions({
        drawingControl: true,
      });
    }
  }

  updatePointList(path: any) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(path.getAt(i).toJSON());
    }
    this.selectedArea = google.maps.geometry.spherical.computeArea(path);
    this.addNewMarkers(this.pointList[0].lat,this.pointList[0].lng,-1,{})
    localStorage.setItem("selectedLand" , JSON.stringify({"selected_area":this.selectedArea,"pointList":this.pointList}))
  }

  buyLand() {
    let totalLandArea = {
      coordinates: this.pointList,
      selectedArea: this.selectedArea,
    };
    if (totalLandArea) {
      let payload = {
        email: localStorage.getItem("email"),
        markers: totalLandArea.coordinates,
        area: totalLandArea.selectedArea,
      };
      this.dataService.buylandFromMap(payload).subscribe(
        (data: any) => {
        }
      );
      this.router.navigate(["map-contract"]);
    } else {
      alert("Please Select land area");
    }
  }
}
