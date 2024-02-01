var models;
$.ajax({
    url: 'data/models.json',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
        models = data;
    },
    error: function (error) {
        console.warn(error);
    }
});

$('#orderTable').DataTable({
    ajax: 'data/orders.json',
    // serverSide: true,
    responsive: true,
    dom: '<"cth"<"toolbar"><"frl"l>>rt<"cth"<i><p>>',
    stripeClasses: ['stripe1', 'stripe2'],
    lengthMenu: [5, 10, 20, 50, 100],
    columns: [
        { 
            data: 'date',
            render: function (data, type, row) {
                let state = '';
                switch (row.state) {
                    case models.states.created: 
                        state = `<span class="state-badge created">Created</span>`;
                        break;
                    case models.states.accepted: 
                        state = `<span class="state-badge accepted">Accepted</span>`;
                        break;
                    case models.states.prepared:
                        state = `<span class="state-badge prepared">Prepared</span>`;
                        break;
                    case models.states.shipped:
                        state = `<span class="state-badge shipped">Shipped</span>`;
                        break;
                    case models.states.delivered:
                        state = `<span class="state-badge delivered">Delivered</span>`;
                        break;
                }
                return `<div class="cell flex-center-col">
                            <div class="flex-center" style="gap:10px;">
                                <span class="orderNumber" style="font-size:16px; font-weight:600;">${row.orderNumber}</span>
                                <button title="Kopyala" class="copyOrderNumber" style="cursor:pointer; font-size:16px; color: var(--main-color); border:none; background:transparent;"><i class="fa-solid fa-copy"></i></button>
                            </div>
                            ${state}
                            <span style="font-size:13px; font-weight:200;">${data}</span>
                        </div>`;
            }
        },
        { 
            data: 'platform',
            render: function (data, type, row) {
                let platform = {};
                switch (row.platform) {
                    case models.platforms.amazon.id: 
                        platform = models.platforms.amazon;
                        break;
                    case models.platforms.ebay.id:
                        platform = models.platforms.ebay;
                        break;
                    case models.platforms.alibaba.id:    
                        platform = models.platforms.alibaba;
                        break;
                    case models.platforms.shopify.id:
                        platform = models.platforms.shopify;
                        break;
                    case models.platforms.magento.id:
                        platform = models.platforms.magento;
                        break;
                }
                return `<div class="cell flex-center">
                            <img src="${platform.logo}" alt="${platform.name}" style="height: 64px;">
                        </div>`;
            }
        },
        { 
            data: 'customer',
            render: function (data, type, row) { 
                return `<div class="cell flex-center">
                            ${data}
                        </div>`;
            }
        },
        { 
            data: 'address',
            render: function (data, type, row) { 
                return `<div class="cell flex-center">
                            ${data}
                        </div>`;
            }
        },
        { 
            data: 'cargo',
            render: function (data, type, row) { 
                let cargo = {};
                switch (row.cargo) {
                    case models.cargos.ups.id:
                        cargo = models.cargos.ups;
                        break;
                    case models.cargos.fedex.id:
                        cargo = models.cargos.fedex;
                        break;
                    case models.cargos.usps.id:
                        cargo = models.cargos.usps;
                        break;
                    case models.cargos.dhl.id:
                        cargo = models.cargos.dhl;
                        break;
                    case models.cargos.amazon.id: 
                        cargo = models.cargos.amazon;
                        break;
                }
                return `<div class="cell flex-center">
                            <img src="${cargo.logo}" alt="${cargo.name}" style="height: 64px;">
                        </div>`;
            }
        },
        { 
            data: 'price',
            render: function (data, type, row) { 
                return `<div class="cell flex-center" style="font-size:18px;">
                            ${data} $
                        </div>`;
            }
        },
        { 
            data: null,
            render: function (data, type, row) { 
                let button = '';
                switch (row.state) {
                    case models.states.created: 
                        button = `<button class="btn btn-accept">Accept</button>`;
                        break;
                    case models.states.accepted: 
                        button = `<button class="btn btn-prepare">Prepare</button>`;
                        break;
                    case models.states.prepared:
                        button = `<button class="btn btn-ship">Ship</button>`;
                        break;
                    case models.states.shipped:
                        button = `<button class="btn btn-deliver">Deliver</button>`;
                        break;
                    case models.states.delivered:
                        button = `<i class="fa-solid fa-check fa-2x" style="color:rgba(6, 177, 58);"></i>`;
                        break;
                }
                return `<div class="cell flex-center">
                            ${button}
                        </div>`;
            }
        }
    ],
    fnRowCallback: function (nRow, data, iDisplayIndex, iDisplayIndexFull) {
        $(nRow).find(".copyOrderNumber").click(function () {
            let copy = $(this).siblings(".orderNumber");
            if (navigator.clipboard) {
                navigator.clipboard.writeText(copy.html())
                    .then(() => alert("Copied to clipboard"))
                    .catch((err) => {
                        console.error("Could not copy to clipboard: ", err);
                        fallbackCopyTextToClipboard(copy.html());
                    });
            } else {
                fallbackCopyTextToClipboard(copy.html());
            }
            function fallbackCopyTextToClipboard(text) {
                let tempInput = document.createElement("input");
                tempInput.setAttribute("value", text);
                document.body.appendChild(tempInput);
                tempInput.select();
                try {
                    document.execCommand("copy");
                    alert("Copied to clipboard");
                } catch (err) {
                    console.error("Could not copy to clipboard: ", err);
                    alert("Could not copy to clipboard");
                } finally {
                    document.body.removeChild(tempInput);
                }
            }
        });
    },
    fnInitComplete: function (data) {
        var toolbar = `<div style="display:flex; gap:12px;">
                        <button class="toolbarButs"><i style="color: rgb(80, 60, 180);" class="fa-solid fa-eye"></i> <span class="mobile-invis">Visibility</span></button>
                        <button class="toolbarButs"><i style="color: rgb(80, 60, 180);" class="fa-solid fa-magnifying-glass"></i> <span class="mobile-invis">Filters<span></button>
                    </div>`;
        $('div.toolbar').html(`<div style="display:flex; gap:10px;"> ${toolbar} </div>`);
    }
    // language: {
    //     processing: `<div class="loadingTable">
    //                     <img id="loading-icon" src="/media/loading.gif" />
    //                 </div>`,
    // },
});