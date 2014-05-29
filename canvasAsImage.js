

(function ($, Canvas2Image, localize) {
    CanvasAsImage = {
        createImageFromCanvas: function createImageFromCanvas(canvas, format, callback) {
            var saveAsImage = Canvas2Image.saveAsPNG;
            switch (format.toLowerCase()) {
                case "png":
                    saveAsImage = Canvas2Image.saveAsPNG;
                    break;
                case "bmp":
                    saveAsImage = Canvas2Image.saveAsBMP;
                    break;
                case "jpeg":
                    saveAsImage = Canvas2Image.saveAsJPEG;
                    break;
                default:
                    break;
            }

            var img = saveAsImage(canvas, format) ||
                Canvas2Image.saveAsPNG(canvas, "png") ||
                Canvas2Image.saveAsPNG(canvas, "bmp") ||
                Canvas2Image.saveAsPNG(canvas, "jpeg");

            if (!img) {
                var msg = localize && localize("CanvasAsImage.notSupportMessage")
                    || "Oh Sorry, but this browser is not capable of creating image files, please use PRINT SCREEN key instead!";

                throw msg;
            }

            var imageOptions;
            eval("imageOptions = " + $(canvas).attr("canvasAsImage"));

            if (!!imageOptions) {
                imageOptions["class"] && $(img).attr("class", imageOptions["class"]);
            }

            $(img).css({ "border": $(canvas).css("border"), "z-index": "9999", "position": "absolute" });

            $(img).insertBefore($(canvas));

            if (typeof callback === "function") {
                callback(img);
            } else {
                $(img).mouseup(function(evt) {
                    setTimeout(function() {
                        $(img).remove();
                    }, 100);
                });
            }

            return img;
        }
    };

    window.CanvasAsImage = CanvasAsImage;

    $(document).ready(function (event) {
        $(document).on("mousedown", "canvas", function (e) {
            if (e.button == 2) {
                var img = CanvasAsImage.createImageFromCanvas(this, "png");

                // For ubuntu chrome:
                setTimeout(function () {
                    $(img).remove();
                }, 500);
            }
        });
    });
})(jQuery, Canvas2Image, null);