<?php /*

  This file is part of a child theme called bAstra.
  Functions in this file will be loaded before the parent theme's functions.
  For more information, please read
  https://developer.wordpress.org/themes/advanced-topics/child-themes/

*/

// this code loads the parent's stylesheet (leave it in place unless you know what you're doing)

function your_theme_enqueue_styles() {

    $parent_style = 'parent-style';

    wp_enqueue_style( $parent_style, 
      get_template_directory_uri() . '/style.css'); 

    wp_enqueue_style( 'child-style', 
      get_stylesheet_directory_uri() . '/style.css', 
      array($parent_style), 
      wp_get_theme()->get('Version') 
    );
}

add_action('wp_enqueue_scripts', 'your_theme_enqueue_styles');

/*  Add your own functions below this line.
    ======================================== */ 
// Debug: Listar todas las plantillas detectadas
add_action('admin_footer', function() {
  if (current_user_can('manage_options')) {
    $templates = wp_get_theme()->get_page_templates();
    echo '<pre style="background:#f00; color:#fff; position:fixed; bottom:0; right:0; z-index:9999;">';
    echo "Plantillas detectadas:\n";
    print_r($templates);
    echo '</pre>';
  }
});

/**
 * Registrar mis plantillas personalizadas manualmente
 */
function registrar_mis_plantillas($templates) {
  // Array con tus plantillas: 'archivo.php' => 'Nombre visible'
  $mis_plantillas = array(
    'template-home.php'      => 'Home',
    // 'template-landing.php'      => 'Landing de Ventas',
    // 'template-herramienta.php'  => 'Calculadora Herramienta',
    // 'template-contacto.php'     => 'Página de Contacto Especial',
    // 'template-blog-custom.php'  => 'Blog Personalizado',
    // 'template-sin-header.php'   => 'Página Sin Header/Footer',
  );
    
  // Combinar con las plantillas existentes
  return array_merge($templates, $mis_plantillas);
}
add_filter('theme_page_templates', 'registrar_mis_plantillas', 999);

