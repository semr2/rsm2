// ui/storage-device.js

export class StorageDeviceUI {

  constructor(container) {
    this.container = container;
  }


  render(storage) {

    this.container.innerHTML = `

      <div class="storage-setup">

        <div class="storage-device-visual">

          <div class="ssd-body">

            <div class="ssd-led"></div>

            <div class="ssd-brand">
              NOVA
            </div>

            <small>
              External SSD
            </small>

          </div>

          <div class="usb-cable"></div>

        </div>


        <div class="storage-information">

          <h2>
            Connect backup storage
          </h2>

          <p>
            Connect the external storage device
            to configure a local backup.
          </p>


          <div class="storage-details">

            <span>
              Capacity
            </span>

            <strong>
              ${this.escape(
                storage.capacity || "1 TB"
              )}
            </strong>

            <span>
              Device
            </span>

            <strong>
              ${this.escape(
                storage.label ||
                "External SSD"
              )}
            </strong>

            <span>
              Connection
            </span>

            <strong>
              USB-C
            </strong>

          </div>


          <button
            id="connect-storage"
          >
            CONNECT DEVICE
          </button>


          <div
            id="storage-status"
            class="storage-status"
          >
            Device not connected
          </div>

        </div>

      </div>
    `;


    this.container
      .querySelector(
        "#connect-storage"
      )
      ?.addEventListener(
        "click",
        () => this.connect()
      );
  }


  connect() {

    const button =
      this.container.querySelector(
        "#connect-storage"
      );

    const status =
      this.container.querySelector(
        "#storage-status"
      );


    button.disabled = true;

    button.textContent =
      "CONNECTING...";


    setTimeout(() => {

      button.textContent =
        "DEVICE CONNECTED";

      status.textContent =
        "External SSD connected — E:";

      status.classList.add(
        "connected"
      );

      this.onConnect?.({
        connected: true,
        drive: "E:"
      });

    }, 1000);
  }


  onConnect(callback) {
    this._callback = callback;
  }


  get onConnect() {
    return this._callback;
  }


  set onConnect(callback) {
    this._callback = callback;
  }


  escape(value = "") {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}


export default StorageDeviceUI;