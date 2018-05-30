new Vue ( {

	el: '#bankdata-prototype',
	data: function () {
		let iban = '',
			bic = '',
			validIBAN = 'DE00123456789012345678',
			validBIC = 'DEUTDEBBXXX',
			validKontonummer = validIBAN.substr(12, 10);
			validBankleitzahl = validIBAN.substr(4, 8);
		return {
			iban: iban,
			bic: bic,
			isValid: true,
			isValidBic: true,
			bicFilled: false,
			focusOut: false,
			bicFocusOut: false,
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
			let bicDOM = document.getElementById( 'bic' );
			if ( this.isIBAN() ) {
				let validIBAN = this.isValidIBAN();
				if ( this.isGermanIBAN() ) {
					bicDOM.readOnly = validIBAN && this.focusOut;
				}
				this.isValid = validIBAN;
				return 'BIC';
			}
			else if ( this.isKontonummer() ) {
				let validKontonummer = this.isValidKontonummmer();
				this.isValid = validKontonummer;
				return "Bankleitzahl"
			}
			bicDOM.readOnly = false;
			this.isValid = true;
			this.bic = '';
			return "BIC/Bankleitzahl"
		},
		classesIBAN: function () {
			return {
				'field-grp': true,
				'field-iba': true,
				'invalid': !this.isValid,
				'valid': this.isValid && !this.isFieldEmpty() && this.focusOut
			}
		},
		classesBIC: function () {
			return {
				'field-grp': true,
				'field-iba': true,
				'invalid': ( !this.isValid && this.focusOut ) || ( !this.isValidBic && !this.isValidIBAN() && this.bicFocusOut && this.focusOut ),
				'valid': this.isValid && !this.isFieldEmpty() && ( ( this.isIBAN() && this.focusOut ) || ( this.isValidBic && this.focusOut && !this.isBicEmpty() ) )
			}
		}
	},
	methods: {
		isFieldEmpty: function () {
			return this.iban === '';
		},
		isBicEmpty: function () {
			return this.bic === '';
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
		fillBIC: function () {
			if ( this.isValid && !this.isFieldEmpty() && this.isIBAN() ) {
				this.bic =  this.validBankData.bic;
			}
			this.focusOut = true;
			//this.isValidBic = false;
		},
		validBic: function () {
			if ( this.bic === this.validBankData.bankl && this.isValidKontonummmer() ) {
				this.isValidBic = true;
			}
			else {
				this.isValidBic = false;
			}
			this.bicFocusOut = true;
		}
	}

} );