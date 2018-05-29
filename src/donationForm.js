$( function () {
  /** global: WMDE */

  var initData = $( '#init-form' ),
    store = WMDE.Store.createDonationStore(),
    actions = WMDE.Actions
    ;

  WMDE.StoreUpdates.connectComponentsToStore(
    [
      WMDE.Components.createAmountComponent(
          store,
          $( '#amount-typed' ),
          $( '.wrap-amounts input[type="radio"]' ),
          $( '#amount-hidden'),
          WMDE.IntegerCurrency.createCurrencyParser( 'de' ),
		  WMDE.IntegerCurrency.createCurrencyFormatter( 'de' )
      ),
      WMDE.Components.createRadioComponent( store, $('input[name="zahlweise"]'), 'paymentType' ),
      WMDE.Components.createRadioComponent( store, $('input[name="periode"]' ), 'paymentIntervalInMonths' ),
      WMDE.Components.createBankDataComponent( store, {
        ibanElement: $( '#iban' ),
        bicElement: $( '#bic' ),
        accountNumberElement: $( '#account-number' ),
        bankCodeElement: $( '#bank-code' ),
        bankNameFieldElement: $( '#field-bank-name' ),
        bankNameDisplayElement: $( '#bank-name' )
      } ),
		WMDE.Components.createRadioComponent( store, $( 'input[name="addressType"]' ), 'addressType' ),
		WMDE.Components.createSelectMenuComponent( store, $( 'select[name="salutation"]' ), 'salutation' ),
		WMDE.Components.createSelectMenuComponent( store, $( '#title' ), 'title' ),
		WMDE.Components.createValidatingTextComponent( store, $( '#first-name' ), 'firstName' ),
		WMDE.Components.createValidatingTextComponent( store, $( '#last-name' ), 'lastName' ),
		WMDE.Components.addEagerChangeBehavior( WMDE.Components.createValidatingTextComponent( store, $( '#company-name' ), 'companyName' ) ),
		WMDE.Components.createValidatingTextComponent( store, $( '#street' ), 'street' ),
		WMDE.Components.createValidatingTextComponent( store, $( '#adress-company' ), 'street' ),
		WMDE.Components.createValidatingTextComponent( store, $( '#post-code' ), 'postcode' ),
		WMDE.Components.createValidatingTextComponent( store, $( '#post-code-company' ), 'postcode' ),
		WMDE.Components.addEagerChangeBehavior( WMDE.Components.createValidatingTextComponent( store, $( '#city' ), 'city' ) ),
		WMDE.Components.addEagerChangeBehavior( WMDE.Components.createValidatingTextComponent( store, $( '#city-company' ), 'city' ) ),
		WMDE.Components.createSelectMenuComponent( store, $( '#country' ), 'country' ),
		WMDE.Components.createSelectMenuComponent( store, $( '#country-company' ), 'country' ),
		WMDE.Components.createValidatingTextComponent( store, $( '#email' ), 'email' ),
		WMDE.Components.createValidatingTextComponent( store, $( '#email-company' ), 'email' ),
		WMDE.Components.createCheckboxComponent( store, $( '#newsletter' ), 'confirmNewsletter' ),
		WMDE.Components.createCheckboxComponent( store, $( '#newsletter-company' ), 'confirmNewsletter' ),
		WMDE.Components.createCheckboxComponent( store, $( '#donation-receipt' ), 'donationReceipt' ),
		WMDE.Components.createCheckboxComponent( store, $( '#donation-receipt-company' ), 'donationReceipt' )
    ],
    store,
    'donationFormContent'
  );

  // Connect view handlers to changes in specific parts in the global state, designated by 'stateKey'
  WMDE.StoreUpdates.connectViewHandlersToStore(
    [
		// Hide anonymous payment when doing direct debit
		{
			viewHandler: WMDE.View.createElementClassSwitcher( $( '#type-donor .wrap-field.anonym .wrap-input' ), /BEZ/, 'disabled' ),
			stateKey: 'donationFormContent.paymentType'
		},
		// Show "needs to support recurring debiting" notice for payments types that provide that info (payment_type_*_recurrent_info)
		{
			viewHandler: WMDE.View.createSimpleVisibilitySwitcher( $( '#payment-method .info-text .info-recurrent' ), /^(1|3|6|12)/ ),
			stateKey: 'donationFormContent.paymentIntervalInMonths'
		},
		{
			viewHandler: WMDE.View.createSuboptionDisplayHandler(
				$( '#recurrence' )
			),
			stateKey: 'donationFormContent.paymentIntervalInMonths'
		},
		{
			viewHandler: WMDE.View.createSuboptionDisplayHandler(
				$( '#donation-payment' )
			),
			stateKey: 'donationFormContent.paymentType'
		},
		{
			viewHandler: WMDE.View.createSuboptionDisplayHandler(
				$( '#type-donor' )
			),
			stateKey: 'donationFormContent.addressType'
		},
		{
			viewHandler: WMDE.View.createFieldValueValidityIndicator( $( '.field-salutation' ) ),
			stateKey: [ WMDE.StateAggregation.Donation.salutationIsValid ]
		},
      {
        viewHandler: WMDE.View.createFieldValueValidityIndicator( $( '.field-firstname' ) ),
        stateKey: 'donationInputValidation.firstName'
      },
      {
        viewHandler: WMDE.View.createFieldValueValidityIndicator( $( '.field-lastname' ) ),
        stateKey: 'donationInputValidation.lastName'
      },
		{
			viewHandler: WMDE.View.createFieldValueValidityIndicator( $('.field-company') ),
			stateKey: 'donationInputValidation.companyName'
		},
      {
        viewHandler: WMDE.View.createFieldValueValidityIndicator( $( '.field-street' ) ),
        stateKey: 'donationInputValidation.street'
      },
      {
        viewHandler: WMDE.View.createFieldValueValidityIndicator( $( '.field-postcode' ) ),
        stateKey: 'donationInputValidation.postcode'
      },
      {
        viewHandler: WMDE.View.createFieldValueValidityIndicator( $( '.field-city' ) ),
        stateKey: 'donationInputValidation.city'
      },
      {
        viewHandler: WMDE.View.createFieldValueValidityIndicator( $( '.field-email' ) ),
        stateKey: 'donationInputValidation.email'
      },
      {
        viewHandler: WMDE.View.createFieldValueValidityIndicator( $( '.field-iban' ) ),
        stateKey: 'donationInputValidation.iban'
      },
      {
        viewHandler: WMDE.View.createFieldValueValidityIndicator( $( '.field-accountnumber' ) ),
        stateKey: 'donationInputValidation.accountNumber'
      },
      {
        viewHandler: WMDE.View.createFieldValueValidityIndicator( $( '.field-bankcode' ) ),
        stateKey: 'donationInputValidation.bankCode'
      },
      {
        viewHandler: WMDE.View.createFieldValueValidityIndicator( $('.wrap-amounts') ),
        stateKey: 'donationInputValidation.amount'
      },
		{
			viewHandler: WMDE.View.createCustomAmountField( $('#amount-typed') ),
			stateKey: 'donationInputValidation.amount'
		},
		{
			viewHandler: WMDE.View.createShySubmitButtonHandler( $( 'form input[type="submit"]' ) ),
			stateKey: [ WMDE.StateAggregation.Donation.allValiditySectionsAreValid ]
		},
		{
			viewHandler: WMDE.View.SectionInfo.createFrequencySectionInfo(
				$( '.banner .frequency' ),
				{
					'0': 'icon-unique',
					'1': 'icon-repeat_1',
					'3': 'icon-repeat_3',
					'6': 'icon-repeat_6',
					'12': 'icon-repeat_12'
				},
				WMDE.FormDataExtractor.mapFromRadioLabels( $( '#recurrence .wrap-input' ) ),
				WMDE.FormDataExtractor.mapFromRadioInfoTexts( $( '#recurrence .wrap-field' ) )
			),
			stateKey: [
				'donationFormContent.paymentIntervalInMonths'
			]
		},
		{
			viewHandler: WMDE.View.SectionInfo.createAmountFrequencySectionInfo(
				$( '.amount' ),
				{
					'0': 'icon-unique',
					'1': 'icon-repeat_1',
					'3': 'icon-repeat_3',
					'6': 'icon-repeat_6',
					'12': 'icon-repeat_12'
				},
				WMDE.FormDataExtractor.mapFromRadioLabels( $( '#recurrence .wrap-input' ) ),
				WMDE.FormDataExtractor.mapFromRadioInfoTexts( $( '#recurrence .wrap-field' ) ),
				WMDE.IntegerCurrency.createCurrencyFormatter( 'de' )
			),
			stateKey: [
				'donationFormContent.amount',
				'donationFormContent.paymentIntervalInMonths',
				WMDE.StateAggregation.Donation.amountAndFrequencyAreValid
			]
		},
		{
			viewHandler: WMDE.View.SectionInfo.createPaymentTypeSectionInfo(
				$( '.payment-method' ),
				{
					'PPL': 'icon-payment-paypal',
					'MCP': 'icon-payment-credit_card',
					'BEZ': 'icon-payment-debit',
					'UEB': 'icon-payment-transfer',
					'SUB': 'icon-payment-sofort'
				},
				WMDE.FormDataExtractor.mapFromRadioLabels( $( '#payment-method .wrap-input' ) ),
				WMDE.FormDataExtractor.mapFromRadioInfoTexts( $( '#payment-method .wrap-field' ) )
			),
			stateKey: [
				'donationFormContent.paymentType',
				'donationFormContent.iban',
				'donationFormContent.bic',
				WMDE.StateAggregation.Donation.paymentAndBankDataAreValid
			]
		},
		{
			viewHandler: WMDE.View.SectionInfo.createDonorTypeSectionInfo(
				$( '.donor-type' ),
				{
					'person': 'icon-account_circle',
					'firma': 'icon-work',
					'anonym': 'icon-visibility_off'
				},
				WMDE.FormDataExtractor.mapFromRadioLabels( $( '#type-donor .wrap-input' ) ),
				WMDE.FormDataExtractor.mapFromSelectOptions( $( '#country' ) )
			),
			stateKey: [
				'donationFormContent.addressType',
				'donationFormContent.salutation',
				'donationFormContent.title',
				'donationFormContent.firstName',
				'donationFormContent.lastName',
				'donationFormContent.companyName',
				'donationFormContent.street',
				'donationFormContent.postcode',
				'donationFormContent.city',
				'donationFormContent.country',
				'donationFormContent.email',
				WMDE.StateAggregation.Donation.donorTypeAndAddressAreValid
			]
		},
		// Show house number warning
      {
        viewHandler: WMDE.View.createSimpleVisibilitySwitcher(
          $( '#street, #adress-company' ).nextAll( '.warning-text' ),
          /^\D+$/
        ),
        stateKey: 'donationFormContent.street'
      }
    ],
    store
  );

	$('form').on( 'submit', function () {
		return WMDE.StateAggregation.Donation.allValiditySectionsAreValid( store.getState() );
	} );

  // Set initial form values
  var initSetup = initData.data( 'initial-form-values' );
  // backend delivers amount as a german-formatted "float" string
  initSetup.amount = WMDE.IntegerCurrency.createCurrencyParser( 'de' ).parse( initSetup.amount );
	// this or touch INITIALIZE_VALIDATION again (values identical to default donation_form_content flagged as changed)
	if ( typeof initSetup.paymentType === 'string' && initSetup.paymentType === '' ) {
		delete initSetup.paymentType;
	}
	if ( initSetup.amount === 0 ) {
		delete  initSetup.amount;
	}
  store.dispatch( actions.newInitializeContentAction( initSetup ) );

	// Set initial validation state
	store.dispatch( actions.newInitializeValidationStateAction(
		initData.data( 'violatedFields' ),
		initSetup,
		initData.data( 'initial-validation-result' )
	) );

	// Non-state-changing event behavior

	var scroller = WMDE.Scrolling.createAnimatedScroller( $( '.wrap-header, .state-bar' ) );

	// Scroll to first required element that needs to be filled
	var currentState = store.getState();
	if ( WMDE.StateAggregation.Donation.formIsPrefilled( currentState ).dataEntered ) {
		// We can assume the validity of amount and interval here, so next section is either payment method or personal data
		var nextRequired = currentState.donationFormContent.paymentType === 'BEZ' ? $( '#payment-method' ) : $( '#donation-type .legend:first' );
		var $introBanner = $('.introduction-banner');
		$introBanner.insertBefore( nextRequired ).removeClass( 'hidden' );

		scroller.scrollTo( $introBanner, { elementStart: WMDE.Scrolling.ElementStart.MARGIN } );
	}

	// Add scroll behaviors to links/input elements

	WMDE.Scrolling.addScrollToLinkAnchors( $( 'a[href^="#"]' ), scroller);
	WMDE.Scrolling.scrollOnSuboptionChange( $( 'input[name="periode"]' ), $( '#recurrence' ), scroller );
	WMDE.Scrolling.scrollOnSuboptionChange( $( 'input[name="addressType"]' ), $( '#type-donor' ), scroller );
	WMDE.Scrolling.scrollOnSuboptionChange( $( 'input[name="zahlweise"]' ), $( '#donation-payment' ), scroller );

} );
