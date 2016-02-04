
import Tesselator = require("./Tesselator");

const TileWidth = 32;
const TileHeight = 32;
const ImageWidth = 256;
const ImageHeight = 256;
const ImagePixWidth = 1;
const ImagePixHeight = 1;
const OffsetX = TileWidth / 2;
const OffsetZ = TileHeight / 2;

class ItemTesselator extends Tesselator {
    
    private static itemsImage: Atomic.Image = <Atomic.Image> Atomic.cache.getResource("Image", "Level/items.png");
    
    //TODO remove copy/paste piece
    public static tesselateItem(geometry: Atomic.CustomGeometry, itemId: number) {
        var items = ItemTesselator.itemsImage;
        var x0 = (Math.floor(itemId * TileWidth) % items.getWidth());
		var y0 = (Math.floor(itemId * TileWidth / items.getWidth()) * items.getHeight());
		var x1 = x0 + TileWidth;
		var y1 = y0 + TileHeight;
        
        var tid = 0;
        
        for (let y:number = y0; y < y1; y++) {
            for (let x:number = x0; x < x1; x++) {
                var pix = items.getPixel(x, y);
                if (pix[3] <= 0.0) {
                    tid++;
                    if (tid % TileWidth == 0) {
                        tid = tid + ImageWidth - TileWidth;
                    }
                    continue;
                }
                
                if (tid != 0 && tid % TileWidth == 0) {
                    tid = tid + ImageWidth - TileWidth;
                }
                
                var pixN = items.getPixel(x, y - 1);
                var pixS = items.getPixel(x, y + 1);
                var pixW = items.getPixel(x - 1, y);
                var pixE = items.getPixel(x + 1, y);
                if (pixN[3] <= 0.0 || y == 0) {
                     Tesselator.addQuad(geometry, [x - OffsetX, 0, (y - 0.5) - OffsetZ], [0, 0, 0], tid, ImagePixWidth, ImagePixHeight);                          
                }
                if (pixS[3] <= 0.0 || y == (y1 - 1)) {
                    Tesselator.addQuad(geometry, [x - OffsetX, 0, (y + 0.5) - OffsetZ], [0, Tesselator.toRad(180), 0], tid, ImagePixWidth, ImagePixHeight);                    
                }                
                if (pixW[3] <= 0.0 || x == 0) {
                    Tesselator.addQuad(geometry, [(x - 0.5) - OffsetX, 0, y - OffsetZ], [0, Tesselator.toRad(90), 0], tid, ImagePixWidth, ImagePixHeight);                    
                }
                if (pixE[3] <= 0.0 || x == (x1 - 1)) {
                    Tesselator.addQuad(geometry, [(x + 0.5) - OffsetX, 0, y - OffsetZ], [0, Tesselator.toRad(-90), 0], tid, ImagePixWidth, ImagePixHeight);
                }
                    
                Tesselator.addQuad(geometry, [x - OffsetX, -0.5, y - OffsetZ], [Tesselator.toRad(-90), 0, 0], tid, ImagePixWidth, ImagePixHeight);
                
                Tesselator.addQuad(geometry, [x - OffsetX, 0.5, y - OffsetZ], [Tesselator.toRad(90), 0, 0], tid, ImagePixWidth, ImagePixHeight);

                tid++;
            }
        }
    }
}

export = ItemTesselator;