new Vue ( {

	el: '#bankdata-prototype',
	data: function () {
		let iban = '',
			validIBAN = 'DE00123456789012345678',
			validBIC = 'DEUTDEBBXXX',
			validKontonummer = validIBAN.substr(12, 10);
			validBankleitzahl = validIBAN.substr(4, 8);
		return {
			iban: iban,
			isValid: true,
			validBankData: {
				iban: validIBAN,
				bic: validBIC,
				konto: validKontonummer,
				bankl: validBankleitzahl
			}
		}
	},
	computed: {
		placeholder: function () {
			let bic = document.getElementById( 'bic' );
			if ( this.isIBAN() ) {
				let validIBAN = this.isValidIBAN();
				if ( this.isGermanIBAN() ) {
					bic.readOnly = validIBAN;
				}
				this.isValid = validIBAN;
				return 'BIC';
			}
			else if ( this.isKontonummer() ) {
				let validKontonummer = this.isValidKontonummmer();
				this.isValid = validKontonummer;
				bic.readOnly = validKontonummer;
				return "Bankleitzahl"
			}
			bic.readOnly = false;
			this.isValid = true;
			bic.value = '';
			return "BIC/Bankleitzahl"
		},
		classObject: function() {
			return {
				'field-grp': true,
				'field-iba': true,
				'invalid': !this.isValid,
				'valid': this.isValid && !this.isFieldEmpty()
			}
		}
	},
	methods: {
		isFieldEmpty: function () {
			return this.iban === '';
		},
		isIBAN: function () {
			return /^[A-Z]+([0-9]+)?$/.test( this.iban );
		},
		isValidIBAN: function () {
			return ( this.iban === this.validBankData.iban ) || ( this.iban === '' );
		},
		isGermanIBAN: function () {
			return /^(DE).*$/.test( this.iban );
		},
		isKontonummer: function () {
			return /^\d+$/.test( this.iban );
		},
		isValidKontonummmer: function () {
			return ( this.iban === this.validBankData.konto ) || ( this.iban === '' );
		},
		inputCompleted: function () {
			return this.iban.length === 22;
		},
		fillBIC: function () {
			if ( this.isValid ) {
				document.getElementById( 'bic' ).value = this.isIBAN() ? this.validBankData.bic : this.validBankData.bankl;
			}
		}
	}

} );