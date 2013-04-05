require(
['game', 'help', 'license', 'jquery', 'domReady!'],
function (Game, help_init, license_init, $) {
  license_init("license", "main_page");

  help_init("main_help", "help_");
  help_init("lvl1_help", "help_");
  help_init("lvl2_help", "help_");
  help_init("lvl3_help", "help_");

  if (window.chrome && window.chrome.i18n) {
    $("#lvl1_quit").html("&nbsp;&nbsp;&nbsp;"+chrome.i18n.getMessage("quit"));
    $("#lvl2_quit").html("&nbsp;&nbsp;&nbsp;"+chrome.i18n.getMessage("quit"));
    $("#lvl3_quit").html("&nbsp;&nbsp;&nbsp;"+chrome.i18n.getMessage("quit"));
    $("#lvl1_hint").text(chrome.i18n.getMessage("hint"));
    $("#lvl2_hint").text(chrome.i18n.getMessage("hint"));
    $("#lvl3_hint").text(chrome.i18n.getMessage("hint"));
    $("#main_lvl1btn").text(chrome.i18n.getMessage("level1"));
    $("#main_lvl2btn").text(chrome.i18n.getMessage("level2"));
    $("#main_lvl3btn").text(chrome.i18n.getMessage("level3"));
    $("#help_contents").html(chrome.i18n.getMessage("help_text"));
  }

  /* if a mouseup happens reset the buttons, this is to maintain */
  /* the original page state if a button is only half clicked */
  $("body").mouseup(function() {
    $('#main_lvl1btn').removeClass("main_lvl1btn_on");
    $('#main_lvl1btn').addClass("main_lvl1btn_off");
    $('#main_lvl2btn').removeClass("main_lvl2btn_on");
    $('#main_lvl2btn').addClass("main_lvl2btn_off");
    $('#main_lvl3btn').removeClass("main_lvl3btn_on");
    $('#main_lvl3btn').addClass("main_lvl3btn_off");
  });

  $('#win_dlg_page').mouseup(function() {
    $('#win_btn1').removeClass("win_btn1_on");
    $('#win_btn1').addClass("win_btn1_off");
    $('#win_btn2').removeClass("win_btn2_on");
    $('#win_btn2').addClass("win_btn2_off");
    $('#win_btn3').removeClass("win_btn3_on");
    $('#win_btn3').addClass("win_btn3_off");
  });

  /* game launch buttons */
  $('#main_lvl1btn').click(function() {
    $("#main_page").hide();
    $("#lvl1_page").show();
    Game.start_game(1);
  });

  $('#main_lvl2btn').click(function() {
    $("#main_page").hide();
    $("#lvl2_page").show();
    Game.start_game(2);
  });

  $('#main_lvl3btn').click(function() {
    $("#main_page").hide();
    $("#lvl3_page").show();
    Game.start_game(3);
  });

  /* setup for game pages */
  $('.quit').click(Game.quit);

  $('.hintrays').click(function() {
    if (!Game.ignore) {
      var id = $(this).attr("id");
      Game.generate_hint(parseInt(id.substring(3, 4)));
    }
  });

  $('.card').click(function(){
    var self = $(this);
    var id = self.attr('id');

    if (!Game.ignore && !($(this).hasClass('flip'))) {
      Game.play_flip();

      /* start the flip animation */
      self.addClass('flip');

      /* ignore clicks during flip */
      Game.input_off();

      /* set the function to be called after the animation has done */
      window.setTimeout(function () {
        Game.card_flipped(id);
      }, Game.fliptime);
    }
  });

  // buttons on the popup shown when level is complete
  $("#win_btn1").click(function() {
    $("#win_dlg_page").hide();
    $(".card").removeClass('flip');
    window.setTimeout(function () {
      Game.start_game(Game.win_level - 1);
    }, Game.fliptime);
  });

  $("#win_btn2").click(function() {
    var next_level = Game.win_level + 1;
    if (next_level > 3) {
      next_level = 1;
    }

    $("#win_dlg_page").hide();
    $("#lvl" + Game.win_level + "_page").hide();
    $("#lvl" + next_level + "_page").fadeIn("fast");

    Game.start_game(next_level);
  });

  $("#win_btn3").click(Game.quit);

  window.onblur = function() {
    if (Game.infocus) {
      Game.infocus = false;
      Game.pause_level_sound();
    }
  };

  window.onfocus = function() {
    if (!Game.infocus) {
      Game.infocus = true;
      Game.play_level_sound();
    }
  };
});