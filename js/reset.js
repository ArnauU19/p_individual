function resetDifficulty2() {
    const default_options = {
        pairs: 2,
        difficulty1: 'normal',
        difficulty2: 1
    };
    
    // Retrieve options from localStorage
    var options = JSON.parse(localStorage.getItem('options') || JSON.stringify(default_options));
    
    // Reset difficulty2 to its original value or to default if original value is not found
    options.difficulty2 = localStorage.getItem('originalDifficulty2') || default_options.difficulty2;
    
    // Save updated options back to localStorage
    localStorage.setItem('options', JSON.stringify(options));
    
    // Optionally, you can reload the page or navigate to another page
    // window.location.reload();
    // or
    // window.location.replace("./some_other_page.html");
}

// Call the function to reset difficulty2
resetDifficulty2();