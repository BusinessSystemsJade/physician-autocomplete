// Dynamically load jQuery and Typeahead.js
var jqueryScript = document.createElement('script');
jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.head.appendChild(jqueryScript);

var typeaheadScript = document.createElement('script');
typeaheadScript.src = 'https://twitter.github.io/typeahead.js/releases/latest/typeahead.bundle.js';
document.head.appendChild(typeaheadScript);

jqueryScript.onload = function() {
  typeaheadScript.onload = function() {
    $(document).ready(function() {
      var physicians = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('first_name', 'last_name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
          url: 'https://dry-cherry-23e4.jfriederick.workers.dev/?query=%QUERY',
          wildcard: '%QUERY'
        }
      });

      // Target Primary Physician First Name (data-index="1")
      var firstNameField = $('input[data-index="1"]');
      
      firstNameField.typeahead({
        hint: true,
        highlight: true,
        minLength: 2
      }, {
        name: 'physicians',
        display: data => `${data.first_name} ${data.last_name}`,
        source: physicians,
        templates: {
          suggestion: data => `<div>${data.first_name} ${data.last_name} — ${data.clinic_name} (${data.city}, ${data.state})</div>`
        }
      });

      firstNameField.bind('typeahead:select', (ev, data) => {
        // Set Physician First and Last Name explicitly
        $('input[data-index="1"]').val(data.first_name);
        $('input[data-index="2"]').val(data.last_name);

        // Set Clinic Information by exact data-index
        $('input[data-index="117199500"]').val(data.clinic_name);
        $('input[data-index="117199501"]').val(data.phone);
        $('input[data-index="117199502"]').val(data.address);
        $('input[data-index="117199503"]').val(data.city);
        $('select[data-index="117199504"]').val(data.state);
      });
    });
  };
};
