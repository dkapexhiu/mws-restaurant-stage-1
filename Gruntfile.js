module.exports = function(grunt) {

    const server_port = process.env.PORT || 8002;
    // Project configuration.
    grunt.initConfig({
        // Prepare dist folder
        connect: {
            server: {
                options: {
                    keepalive: true,
                    base: 'img/',
                    port: server_port
                }
            }
        },

        // Process images
        responsive_images: {
            large: {
                options: {
                    sizes: [{
                        width: 512,
                        suffix: '.jpg-512_1x',
                        quality: 60
                    }]
                },
                files: [{
                    expand: true,
                    src: ['img/*.{gif,jpg,png}'],
                    cwd: 'img_orig/',
                    dest: 'img/'
                }]
            },
            small: {
                options: {
                    sizes: [{
                        width: 380,
                        suffix: '.jpg-380_1x',
                        quality: 60
                    }]
                },
                files: [{
                    expand: true,
                    src: ['img/*.{gif,jpg,png}'],
                    cwd: 'img_orig/',
                    dest: 'img/'
                }]
            },
        },
        
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-responsive-images');

    grunt.registerTask('optimize_images', [
        'responsive_images:large',
        'responsive_images:small',
    ]);
    grunt.registerTask('default', ['optimize_images']);
};