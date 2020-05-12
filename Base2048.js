(function($)
{
    $.fn.game2048 = function()
    {
        function definesize(X,Y) // définit la taille des grilles suivant la taille spécifiée par l'utilisateur
        {
            var sizex = (X * 500) / 4;
            var sizehead = (X * 500) / 4;
            var sizey = (Y * 500) / 4;
            $(".grille").css("width", sizex);
            $(".grille").css("height", sizey);
            $(".infos").css("width", sizehead);
        }

        function generateMap() // génére la grille suivant la taille spécifiée par l'utilisateur
        {
            let table = $('<table class="grille"></table>');
            for (let y = 0; y < sizeY; y++)
            {
                let line = $('<tr></tr>');
                for (let x = 0; x < sizeX; x++)
                {
                    let cell = $('<td>0</td>').attr('x', x).attr('y', y).attr('nbr', 0);
                    line.append(cell);
                }
                table.append(line);
            }
            return table;            
        }

        function cleartable() // "nettoie" l'affichage de la table (enlève toutes les valeurs visibles)
        {
            for (let y = 0; y < sizeY; y++)
            {
                for (let x = 0; x < sizeX; x++)
                {
                    let elem = $("[x=" + x + "][y=" + y + "]");
                    elem.text("");                   
                }  
            }              
        }

        function generateCell(cells) // génére un nombre défini de cellules "2" ou "4" aléatoirement (en génére une si pas de paramètres) 
        {
            if (cells === undefined)
            {
                cells = 1;
            }
            for (let i = 0; i < cells; i++)
            {
                let empty = false;
                while (empty === false)
                {
                    let x = Math.floor((Math.random() * sizeX));
                    let y = Math.floor((Math.random() * sizeY));
                    var elem = $('[x="' + x + '"][y="' + y + '"][nbr=0]');
                    if (elem[0])
                    {
                        empty = true;
                    }                        
                }
                let value =  2 * (Math.floor((Math.random() * 2) + 1));
                if (value === 4 && Math.random() > 0.5)
                {
                    value = 2;
                }
                elem.attr('nbr', value);
                elem.addClass("bloc" + value);
                elem.text(value);
                elem.fadeTo(100, 0.5, function() { $(this).fadeTo(300, 1.0); });
            }
        }

        function getCookie(cname) // récupère la valeur du cookie recherché
        {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++)
            {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0)
                {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }      
        
        function displayscore() // affiche le score
        {
            $(".score").replaceWith('<td class="casesinfos score">Score<br>' + score + "</td>");            
        }

        function displayhighscore() // affiche le high score
        {
            $(".highscore").replaceWith('<td class="casesinfos highscore">Record<br>' + highscore + "</td>");            
        }

        function displayrecordman() // affiche le nom du détenteur du record
        {
            $(".recordman").replaceWith('<p class="recordman">Meilleur score détenu par ' + recordname + '</p>');
        }

        function reset() // réinitialise la partie
        {
            for (let y = 0; y < sizeY; y++)
            {
                for (let x = 0; x < sizeX; x++)
                {
                    let elem = $("[x=" + x + "][y=" + y + "]");
                    elem.attr('nbr', 0);
                    elem.removeClass();
                    elem.text("");   
                    if ((score > highscore) && (sizeX == 4) && (sizeY == 4))
                    {
                        highscore = score;
                        document.cookie = "rush2048=" + highscore + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                        recordname = name;
                        document.cookie = "rush2048name=" + recordname + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                    }            
                    score = 0;
                    displayscore();
                    displayhighscore();
                    displayrecordman();
                }  
            }                
        }        

        $(".rejouer").on({ // événements du bouton "rejouer" 
            mouseenter:function(){ 
                $(this).css("background-color", "#5da0fa"); 
                $(this).css("border", "2px #5da0fa");     
            },
            mouseleave:function(){ 
                $(this).css("background-color", "#f35463");
                $(this).css("border", "2px #f35463");
            },
            click:function(){  

                reset();
                generateCell(2);
            }
        });        
        
        function full() // détermine si la grille est plein de nombres autres que zéro
        {
            for (let x = 0; x < sizeX; x++)
            {
                for (let y = 0; y < sizeY; y++)
                {
                    let elem = $("[x=" + x + "][y=" + y + "]");
                    if (elem.attr('nbr') == 0)
                    {
                        return false;                        
                    }                                      
                }  
            }         
            return true;                    
        }

        function canmove() // détermine si un mouvement de fusion est possible
        {
            for (let x = 0; x < sizeX; x++)
            {
                for (let y = 0; y < (sizeY - 1); y++)
                {
                    let y2 = y + 1;
                    let elem1 = $("[x=" + x + "][y=" + y + "]");
                    let elem2 = $("[x=" + x + "][y=" + y2 + "]");                                    
                    if (elem1.attr('nbr') == elem2.attr('nbr'))
                    {
                        return true;                        
                    }                                      
                }  
            }    
            for (let y = 0; y < sizeY; y++)
            {
                for (let x = 0; x < (sizeX - 1); x++)
                {
                    let x2 = x + 1;
                    let elem1 = $("[x=" + x + "][y=" + y + "]");
                    let elem2 = $("[x=" + x2 + "][y=" + y + "]");                                    
                    if (elem1.attr('nbr') == elem2.attr('nbr'))
                    {
                        return true;                        
                    }                                      
                }  
            }         
            return false;
        }

        function iswin() // détermine si la victoire est déclenchée
        {
            for (let x = 0; x < sizeX; x++)
            {
                for (let y = 0; y < sizeY; y++)
                {
                    let elem = $("[x=" + x + "][y=" + y + "]");
                    if (elem.attr('nbr') == 2048)
                    {
                        displaywin();                      
                    }                                      
                }  
            }         
            return false;
        }

        function displaywin() // affichage de la victoire
        {
            win = true;
            pause = true;
            document.getElementById("overlaywin").style.display = "block";
        }

        function defeat() // affichage de la défaite
        {
            pause = true;
            document.getElementById("overlaylose").style.display = "block";
        }

        $("#overlaywin").on({ // sortir de l'écran de victoire 
            click:function(){  
                document.getElementById("overlaywin").style.display = "none";
                pause = false;
            }
        });

        $("#overlaylose").on({ // sortir de l'écran de défaite 
            click:function(){  
                document.getElementById("overlaylose").style.display = "none";
                pause = false;
                reset();
                generateCell(2);
            }
        });

        $('html').keydown(function(event) { // gestion des touches clavier
            switch (event['key']) {
                case 'ArrowLeft': 
                    if (pause == false)
                    {
                        moveleft();
                        console.log("Left");
                    }                      
                    break;
                case 'ArrowUp':
                    if (pause == false)
                    {
                        moveup();
                        console.log("Up");
                    }
                    break;
                case 'ArrowRight':
                    if (pause == false)
                    {
                        moveright();
                        console.log("Right");
                    } 
                    break;
                case 'ArrowDown':
                    if (pause == false)
                    {
                        movedown();
                        console.log("Down");
                    } 
                    break;
            }
        });

        function pushleft()  // "pousse" toutes les cases qui ne sont pas des zéro à gauche
        {
            let move = 0;
            for (let y = 0; y < sizeY; y++)
            {
                for (let x = 0; x < (sizeX - 1); x++)
                {
                    let elem1 = $("[x=" + x + "][y=" + y + "]");
                    if (elem1.attr('nbr') == 0)
                    {
                        for (let x2 = x + 1 ; x2 < sizeX ; x2++)
                        {
                            let elem2 = $("[x=" + x2 + "][y=" + y + "]");                            
                            if (elem2.attr('nbr') != 0)
                            {              
                                move++;                  
                                elem1.attr('nbr', elem2.attr('nbr'));
                                elem1.removeClass().addClass("bloc" + elem2.attr('nbr'));
                                elem1.text(elem2.attr('nbr'));
                                elem2.attr('nbr', 0);
                                elem2.removeClass();
                                elem2.text("");
                                break;
                            }
                        }
                    }
                }      

            }   
            return move; 
        }

        function pushright()  // "pousse" toutes les cases qui ne sont pas des zéro à droite
        {
            let move = 0;
            for (let y = 0; y < sizeY; y++)
            {
                for (let x = (sizeX - 1); x > 0; x--)
                {
                    let elem1 = $("[x=" + x + "][y=" + y + "]");
                    if (elem1.attr('nbr') == 0)
                    {
                        for (let x2 = x - 1 ; x2 >=0 ; x2--)
                        {
                            let elem2 = $("[x=" + x2 + "][y=" + y + "]");                            
                            if (elem2.attr('nbr') != 0)
                            {       
                                move++;                         
                                elem1.attr('nbr', elem2.attr('nbr'));
                                elem1.removeClass().addClass("bloc" + elem2.attr('nbr'));
                                elem1.text(elem2.attr('nbr'));
                                elem2.attr('nbr', 0);
                                elem2.removeClass();
                                elem2.text("");
                                break;
                            }
                        }
                    }
                }      
            }    
            return move;
        }

        function pushup()  // "pousse" toutes les cases qui ne sont pas des zéro en haut
        {
            let move = 0;
            for (let x = 0; x < sizeX; x++)
            {
                for (let y = 0; y < (sizeY - 1); y++)
                {
                    let elem1 = $("[x=" + x + "][y=" + y + "]");
                    if (elem1.attr('nbr') == 0)
                    {
                        for (let y2 = y + 1 ; y2 < sizeY ; y2++)
                        {
                            let elem2 = $("[x=" + x + "][y=" + y2 + "]");                            
                            if (elem2.attr('nbr') != 0)
                            {       
                                move++;                         
                                elem1.attr('nbr', elem2.attr('nbr'));
                                elem1.removeClass().addClass("bloc" + elem2.attr('nbr'));
                                elem1.text(elem2.attr('nbr'));
                                elem2.attr('nbr', 0);
                                elem2.removeClass();
                                elem2.text("");
                                break;
                            }
                        }
                    }
                }  
            }    
            return move;
        }

        function pushdown()  // "pousse" toutes les cases qui ne sont pas des zéro en bas
        {
            let move = 0;
            for (let x = 0; x < sizeX; x++)
            {
                for (let y = (sizeY - 1); y > 0; y--)
                {
                    let elem1 = $("[x=" + x + "][y=" + y + "]");
                    if (elem1.attr('nbr') == 0)
                    {
                        for (let y2 = y - 1 ; y2 >= 0 ; y2--)
                        {
                            let elem2 = $("[x=" + x + "][y=" + y2 + "]");                            
                            if (elem2.attr('nbr') != 0)
                            {       
                                move++;                         
                                elem1.attr('nbr', elem2.attr('nbr'));
                                elem1.removeClass().addClass("bloc" + elem2.attr('nbr'));
                                elem1.text(elem2.attr('nbr'));
                                elem2.attr('nbr', 0);
                                elem2.removeClass();
                                elem2.text("");
                                break;
                            }
                        }
                    }
                }   
            }    
            return move;
        }

        function mergeleft() // fusionne les cellules identiques vers la gauche
        {
            let move = 0;
            for (let y = 0; y < sizeY; y++)
            {
                for (let x = 0; x < (sizeX - 1); x++)
                {
                    let elem1 = $("[x=" + x + "][y=" + y + "]");
                    if (elem1.attr('nbr') == 0)
                    {
                        break;                        
                    }
                    let x2 = x + 1;
                    let elem2 = $("[x=" + x2 + "][y=" + y + "]");
                    if (elem1.attr('nbr') == elem2.attr('nbr'))
                    {
                        move++;
                        let newnbr = elem1.attr('nbr') * 2;     
                        score = score + newnbr;                 
                        elem1.attr('nbr', newnbr);
                        elem1.removeClass().addClass("bloc" + newnbr);
                        elem1.text(newnbr);
                        elem2.attr('nbr', 0);
                        elem2.removeClass();
                        elem2.text("");  
                        pushleft();                      
                    }                   
                }  
            }  
            return move;              
        }

        function mergeright() // fusionne les cellules identiques vers la droite
        {
            let move = 0;
            for (let y = 0; y < sizeY; y++)
            {
                for (let x = (sizeX - 1); x > 0; x--)
                {
                    let elem1 = $("[x=" + x + "][y=" + y + "]");
                    if (elem1.attr('nbr') == 0)
                    {
                        break;                        
                    }
                    let x2 = x - 1;
                    let elem2 = $("[x=" + x2 + "][y=" + y + "]");
                    if (elem1.attr('nbr') == elem2.attr('nbr'))
                    {
                        move++;
                        let newnbr = elem1.attr('nbr') * 2; 
                        score = score + newnbr;                     
                        elem1.attr('nbr', newnbr);
                        elem1.removeClass().addClass("bloc" + newnbr);
                        elem1.text(newnbr);
                        elem2.attr('nbr', 0);
                        elem2.removeClass();
                        elem2.text("");  
                        pushright();                      
                    }                   
                }  
            }  
            return move;               
        }

        function mergeup() // fusionne les cellules identiques vers le haut
        {
            let move = 0;
            for (let x = 0; x < sizeX; x++)
            {
                for (let y = 0; y < sizeY; y++)
                {
                    let elem1 = $("[x=" + x + "][y=" + y + "]");
                    if (elem1.attr('nbr') == 0)
                    {
                        break;                        
                    }
                    let y2 = y + 1;
                    let elem2 = $("[x=" + x + "][y=" + y2 + "]");
                    if (elem1.attr('nbr') == elem2.attr('nbr'))
                    {
                        move++;
                        let newnbr = elem1.attr('nbr') * 2;   
                        score = score + newnbr;                   
                        elem1.attr('nbr', newnbr);
                        elem1.removeClass().addClass("bloc" + newnbr);
                        elem1.text(newnbr);
                        elem2.attr('nbr', 0);
                        elem2.removeClass();
                        elem2.text("");  
                        pushup();                      
                    }                   
                }  
            }      
            return move;           
        }

        function mergedown() // fusionne les cellules identiques vers le bas
        {
            let move = 0;
            for (let x = 0; x < sizeX; x++)
            {
                for (let y = (sizeY - 1); y > 0; y--)
                {
                    let elem1 = $("[x=" + x + "][y=" + y + "]");
                    if (elem1.attr('nbr') == 0)
                    {
                        break;                        
                    }
                    let y2 = y - 1;
                    let elem2 = $("[x=" + x + "][y=" + y2 + "]");
                    if (elem1.attr('nbr') == elem2.attr('nbr'))
                    {
                        move++;
                        let newnbr = elem1.attr('nbr') * 2;  
                        score = score + newnbr;                    
                        elem1.attr('nbr', newnbr);
                        elem1.removeClass().addClass("bloc" + newnbr);
                        elem1.text(newnbr);
                        elem2.attr('nbr', 0);
                        elem2.removeClass();
                        elem2.text("");  
                        pushdown();                      
                    }                   
                }  
            }         
            return move;        
        }    

        function moveleft() // actions de la flèche gauche
        {
            let move = 0; 
            move = pushleft();
            move = move + mergeleft();
            if ((score > highscore) && (sizeX == 4) && (sizeY == 4))
            {
                highscore = score;
                document.cookie = "rush2048=" + highscore + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                recordname = name;
                document.cookie = "rush2048name=" + recordname + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            }  
            displayscore();
            displayhighscore();
            displayrecordman();
            if (win == false)
            {
                iswin();
            }
            let filled = full();
            if (filled == true)
            {                
                let possiblemove = canmove();
                if (possiblemove == false)
                {
                    defeat();
                }                
            }
            if (move != 0)
            {
                generateCell();
            }        
        }

        function moveright() // actions de la flèche droite
        {
            let move = 0;
            move = pushright();
            move = move + mergeright();
            if ((score > highscore) && (sizeX == 4) && (sizeY == 4))
            {
                highscore = score;
                document.cookie = "rush2048=" + highscore + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                recordname = name;
                document.cookie = "rush2048name=" + recordname + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            }  
            displayscore();
            displayhighscore();
            displayrecordman();
            if (win == false)
            {
                iswin();
            }
            let filled = full();
            if (filled == true)
            {                
                let possiblemove = canmove();
                if (possiblemove == false)
                {
                    defeat();
                }                
            }
            if (move != 0)
            {
                generateCell();
            }         
        }

        function moveup() // actions de la flèche haute
        {
            let move = 0;
            move = pushup();
            move = move + mergeup();
            if ((score > highscore) && (sizeX == 4) && (sizeY == 4))
            {
                highscore = score;
                document.cookie = "rush2048=" + highscore + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                recordname = name;
                document.cookie = "rush2048name=" + recordname + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            }  
            displayscore();
            displayhighscore();
            displayrecordman();
            if (win == false)
            {
                iswin();
            }
            let filled = full();
            if (filled == true)
            {                
                let possiblemove = canmove();
                if (possiblemove == false)
                {
                    defeat();
                }                
            }
            if (move != 0)
            {
                generateCell();
            }         
        }

        function movedown() // actions de la flèche basse
        {
            let move = 0; 
            move = pushdown();
            move = move + mergedown();
            if ((score > highscore) && (sizeX == 4) && (sizeY == 4))
            {
                highscore = score;
                document.cookie = "rush2048=" + highscore + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                recordname = name;
                document.cookie = "rush2048name=" + recordname + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            }  
            displayscore();
            displayhighscore();
            displayrecordman();
            if (win == false)
            {
                iswin();
            }
            let filled = full();
            if (filled == true)
            {                
                let possiblemove = canmove();
                if (possiblemove == false)
                {
                    defeat();
                }                
            }
            if (move != 0)
            {
                generateCell();
            }         
        }      

        // ACTIONS AU LANCEMENT DE LA PAGE
        var sizeX = 0;
        var sizeY = 0;
        var pause = false;
        var name = "";
        while (name == "" || name == null || name.length > 20)
        {
            name = prompt("Bienvenue, veuillez entrer votre nom !");
        }        
        alert("Vous allez maintenant choisir la taille de votre grille !\n(attention, seules les grilles classiques en 4*4 sont comptabilisées pour les records)");
        while (sizeX < 3 || sizeX > 10 || Number.isInteger(sizeX) == false )
        {
            sizeX = parseInt(prompt("Quelle taille voulez-vous pour les abscisses ?\n(la taille doit être comprise entre 3 et 10)", 4));
        }
        while (sizeY < 3 || sizeY > 10 || Number.isInteger(sizeY) == false)
        {
            sizeY = parseInt(prompt("Quelle taille voulez-vous pour les ordonnées ?\n(la taille doit être comprise entre 3 et 10)", 4));
        }      
        definesize(sizeX, sizeY);        
        var win = false;
        var score = 0;         
        var recordname = "";  
        var cookiename = getCookie("rush2048name");  
        if (cookiename == "")
        {
            document.cookie = "rush2048name=''; expires=Fri, 31 Dec 9999 23:59:59 GMT"
        }
        else
        {
            recordname = cookiename;
        }     
        var highscore = 0;
        var cookie = getCookie("rush2048");
        if (cookie == "")
        {
            document.cookie = "rush2048=0; expires=Fri, 31 Dec 9999 23:59:59 GMT"
        }
        else
        {
            highscore = cookie;
        }        
        $(this).append(generateMap());
        cleartable();
        generateCell(2);        
        displayhighscore();
        displayrecordman();
    }
})(jQuery);








