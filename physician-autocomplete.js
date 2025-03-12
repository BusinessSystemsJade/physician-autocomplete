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

      $('input[name="Primary Physician - First Name"]').typeahead({
        hint: true,
        highlight: true,
        minLength: 2
      }, {
        name: 'physicians',
        display: data => data.first_name + ' ' + data.last_name,
        source: physicians,
        templates: {
          suggestion: data => `<div>${data.first_name} ${data.last_name} — ${data.clinic_name} (${data.city}, ${data.state})</div>`
        }
      });

      $('input[name="Primary Physician - First Name"]').bind('typeahead:select', (ev, data) => {
        $('input[name="Primary Physician - First Name"]').val(data.first_name);
        $('input[name="Primary Physician - Last Name"]').val(data.last_name);
        $('input[name="Clinic name"]').val(data.clinic_name);
        $('input[name="Clinic phone"]').val(data.phone);
        $('input[name="Clinic address"]').val(data.address);
        $('input[name="Clinic city"]').val(data.city);
        $('select[name="Clinic State"]').val(data.state);
      });
    });
  };
};
