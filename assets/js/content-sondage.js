/**
 * The full survey is contained in a div or article that has class "quizz".
 * Then one question is inside a zmarkdown "custom-block" of type "custom-block-quizz".
 *
 * <code>
 *   <div class="custom-block custom-block-quizz">
 *     <div class="custom-block-heading">The question</div>
 *     <div class="custom-block-body">
 *       <ul>
 *            <li><input type="checkbox" value="the answer"/>the answer</li>
 *            <li><input type="checkbox" value="the answer" />the answer</li>
 * 
 *       </ul>
 *     </div>
 *   </div>
 * </code>

 */

var currentURL = window.location.href;

if (currentURL.includes("forums")) {

  let indeX = 0;
  function Makesurvey(inputDomElementList) {

    let idli = 0
    inputDomElementList.forEach((rb) => {


      const ulWrapperElement = rb.parentElement.parentElement
      // we give the ui an id to find the element in a more effective way later when the users answer the questions
      if (!ulWrapperElement.getAttribute('id')) {
        ulWrapperElement.setAttribute('id', 'id-' + (indeX++))
      }
      rb.parentElement.classList.add('sondage');
      // rb.parentElement.classList.remove('task-list-item');
      rb.setAttribute('name', ulWrapperElement.getAttribute('id'))
      rb.setAttribute('id', ulWrapperElement.getAttribute('id') + '-' + idli)
      idli++
      rb.setAttribute('type', 'checkbox')
      rb.disabled = false

      const questionBlock = ulWrapperElement.parentElement.parentElement
      questionBlock.setAttribute('data-name', rb.getAttribute('name'))


    })
  }
// add labels to li elements
  function AnswersAsLabels() {

    var checkboxli = document.querySelectorAll('.custom-block-quizz ul li')

    checkboxli.forEach((li) => {
      var input = li.querySelector('input[type=checkbox]')
      var label = document.createElement('label')
      label.setAttribute('for', input.getAttribute('id'))
      label.classList.add('answer-label')
      label.innerHTML = li.querySelector('span.math') ? li.querySelector('span.math').innerHTML : li.innerText
      li.textContent = ''
      li.appendChild(input)
      li.appendChild(label)
    })
  }

  function SurveyButtons(survey) {


    const submit = document.createElement('button')
    submit.innerText = 'Voter'

    submit.classList.add('btn', 'btn-submit')
    submit.setAttribute('id', `my-button-${idCounter}`);

    const notAnswered = document.createElement('p')
    notAnswered.classList.add('notAnswered-sondage')

    survey.appendChild(submit)
    survey.parentElement.parentElement.parentElement.appendChild(notAnswered)

  }

  function initializeSurvey() {
    const radio = document.querySelectorAll('.custom-block-quizz input');
    Makesurvey(radio)
    document.querySelectorAll('div.custom-block-quizz').forEach(div => {
      SurveyButtons(div)
    })
    AnswersAsLabels()

  }

  const initializePipeline = [initializeSurvey]

  let idCounter = 0

  initializePipeline.forEach(func => func())

// send response to server
  function sendSurvey(data) {

    const csrfmiddlewaretoken = document.querySelector('input[name=\'csrfmiddlewaretoken\']').value
    const xhttp = new XMLHttpRequest()
    const url = '/forums/survey/'
    xhttp.open('POST', url)
    xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.setRequestHeader('X-CSRFToken', csrfmiddlewaretoken)
    xhttp.send(JSON.stringify(data))
  }

  // Get statistics from DB and display it
  function GetSurveyStats(data, div) {

    const newData = {
      "survey": data.survey,
      "url": data.url,
      "owner": data.owner
    };
    const csrfmiddlewaretoken = document.querySelector('input[name=\'csrfmiddlewaretoken\']').value
    const xhttp = new XMLHttpRequest()
    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response_data = JSON.parse(xhttp.responseText);

        // Loop through each list item
        div.querySelectorAll("li").forEach((li) => {
          // Get the label element and its text content
          const label = li.querySelector("label");
          const labelText = label.textContent;
          // Get the result data for the current label text
          const resultData = response_data.choices.find((choice) => choice.choice === labelText);
          // If result data exists, create a progress element and append it to the label
          if (resultData) {
            const progress = document.createElement("progress");
            progress.value = resultData.counter;
            progress.max = response_data.total;
            const percentage = Math.round((resultData.counter / data.total) * 100);
            const textNode = document.createTextNode(` ${resultData.counter}/${data.total} (${percentage}%)`);
            label.after(progress, textNode);
          }
        });
      }
    });
    xhr.open('POST', '/survey_Result/');
    xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.setRequestHeader('X-CSRFToken', csrfmiddlewaretoken)
    xhttp.send(JSON.stringify(newData))


  }


  function FakeGetSurveyStats(div) {

    // change elements to fitt with you survey for test
    data = {
      "choices": [
        {
          "choice": "YES",
          "counter": 5
        },
        {
          "choice": "NO",
          "counter": 4
        },
        {
          "choice": "May be",
          "counter": 9
        },
        {
          "choice": "I don’t want",
          "counter": 2
        }
      ],
      "total": 20
    }

    // Loop through each list item
    div.querySelectorAll("li").forEach((li) => {
      // Get the label element and its text content
      const label = li.querySelector("label");
      const labelText = label.textContent;
      // Get the result data for the current label text
      const resultData = data.choices.find((choice) => choice.choice === labelText);
      // If result data exists, create a progress element and append it to the label
      if (resultData) {
        const progress = document.createElement("progress");
        progress.value = resultData.counter;
        progress.max = data.total;
        const percentage = Math.round((resultData.counter / data.total) * 100);
        const textNode = document.createTextNode(` ${resultData.counter}/${data.total} (${percentage}%)`);
        label.after(progress, textNode);
      }
    });

  }

  function DataExtract(div) {

    // Create the JSON object
    const data = {};

    const title = div.querySelector('.custom-block-heading').innerText
    const options = div.querySelectorAll('input[type="checkbox"]');
    // Extract the text content of the options
    const choices = [];
    options.forEach(option => {
      choices.push(option.parentNode.textContent.trim());
    });

    const message = div.parentElement.parentElement.parentElement
    const SurveyOwner = message.querySelector('.username').innerText;
    const Surveyurl = message.querySelector('.date').href

    const survey = {}
    survey[title] = choices
    data["survey"] = survey
    data["url"] = Surveyurl
    data["owner"] = SurveyOwner

    return data
  }
  document.querySelectorAll('div.custom-block-quizz').forEach(div => {
    const submit = div.querySelector('.btn-submit')
    let data = DataExtract(div)
    submit.addEventListener('click', () => {

      const checkedInput = div.querySelector('input:checked');

      if (checkedInput) {
        data["result"] = [checkedInput.parentElement.innerText]
        div.parentElement.parentElement.parentElement.querySelector('.notAnswered-sondage').innerText = ''
        div.querySelector('.btn-submit').disabled = true
        // sendSurvey(data);
        // GetSurveyStats(data,div)
        FakeGetSurveyStats(div)
      }
      else {
        div.parentElement.parentElement.parentElement.querySelector('.notAnswered-sondage').innerText = " Veuillez choisir une réponse d'abord "
      }

    })
  })

}


