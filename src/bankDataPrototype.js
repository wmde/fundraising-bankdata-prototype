new Vue ( {

	el: '#bankdata-prototype',
	data: {
			iban: ''
	},
	computed: {
		placeholder: function () {
			let bic = document.getElementById( 'bic' );
			if ( this.isIBAN() ) {
				if ( this.isGermanIBAN() ) {
					bic.value = '12345678';
					bic.readOnly = true;
					return '12345678'
				}
				else
					bic.readOnly = false;
					return 'BIC';
			}
			else if ( this.isKontonummer() ) {
				bic.readOnly = false;
				return "Bankleitzahl"
			}
			bic.readOnly = false;
			bic.value = '';
			return "BIC/Bankleitzahl"
		}
	},
	methods: {
		isIBAN: function () {
			return /^[A-Z]+([0-9]+)?$/.test( this.iban );
		},
		isGermanIBAN: function () {
			return /^(DE).*$/.test( this.iban );
		},
		isKontonummer: function () {
			return /^\d+$/.test( this.iban );
		}
	}

} );