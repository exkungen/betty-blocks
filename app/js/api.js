$( document ).ready(function() {
    removeSkill = (e) => {
        let data = e.target.parentNode;
        let dataId = data.getAttribute("data-id");
        $.ajax({
            type: "POST",
            url: "/delete_skill",
            data: `id=${dataId}`,
            succes: data.remove(),
          });
    };
    showModal = (e) => {
        let modal = $('#modal');
        modal.show();
        let skillName = e.target.childNodes[0].nodeValue;
        // let skillName = e.target.value;
        console.log(skillName);
        let skillId = e.target.parentNode;
        $("#skill").val(skillId.getAttribute("data-id"));
        $('#skillEdit').val(skillName);
          $( ".close" ).click(function() {
            modal.hide();
          });
    }
    editSkill = () => {
        let modal = $('#modal');
        let skillId = $("#skill").val();
        let skillName = $("#skillEdit").val();
        $.ajax({
            type: "POST",
            url: "/edit_skill",
            data: `id=${skillId}&name=${skillName}`,
            success: function() {
                let editedSkill = $(`[data-id="${skillId}"]`);
                editedSkill[0].innerHTML = skillName + '<i class="fas fa-times icon-remove" onclick="removeSkill(event)"></i>';
               modal.hide();
            },
          });
    }
});