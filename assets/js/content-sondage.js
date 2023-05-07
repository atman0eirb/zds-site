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


    inputDomElementList.forEach((rb) => {


      const ulWrapperElement = rb.parentElement.parentElement
      // we give the ui an id to find the element in a more effective way later when the users answer the questions
      if (!ulWrapperElement.getAttribute('id')) {
        ulWrapperElement.setAttribute('id', 'id-' + (indeX++))
      }

      rb.setAttribute('name', ulWrapperElement.getAttribute('id'))
      rb.setAttribute('type', 'radio')

      const questionBlock = ulWrapperElement.parentElement.parentElement
      questionBlock.setAttribute('data-name', rb.getAttribute('name'))


      rb.disabled = false
      rb.checked = false

    })
  }

  function SurveyButtons(survey) {


    const submit = document.createElement('button')
    submit.innerText = 'Voter'

    submit.classList.add('btn', 'btn-submit')
    submit.setAttribute('id', `my-button-${idCounter}`);

    const notAnswered = document.createElement('p')
    notAnswered.classList.add('notAnswered')

    survey.appendChild(submit)
    survey.parentElement.parentElement.parentElement.appendChild(notAnswered)

  }

  function initializeRadio() {
    const radio = document.querySelectorAll('.custom-block-quizz input');
    Makesurvey(radio)
    document.querySelectorAll('div.custom-block-quizz').forEach(div => {
      SurveyButtons(div)
    })

  }

  const initializePipeline = [initializeRadio]

  let idCounter = 0

  initializePipeline.forEach(func => func())


  // not complet , a test example only
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
  function DataExtract(div) {

    // Create the JSON object
    const data = {};

    const title = div.querySelector('.custom-block-heading').innerText
    // Get the radio button options
    const options = div.querySelectorAll('input[type="radio"]');
    // Extract the text content of the options
    const choices = [];
    options.forEach(option => {
      choices.push(option.parentNode.textContent.trim());
    });

    const message = div.parentElement.parentElement.parentElement
    const SurveyOwner = message.querySelector('.username').innerText;
    const Surveyurl = message.querySelector('.date').href

    data[title] = choices
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
        sendSurvey(data);
      }
      else {
        div.parentElement.parentElement.parentElement.querySelector('.notAnswered').innerText = " Veuillez choisir d'abord "
      }

    })
  })

}


