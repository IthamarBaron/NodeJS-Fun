const SendDetails = async () => 
{
    const username = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    try 
    {
        const response = await fetch("http://localhost:3000/submit", 
        {
            method: "POST",
            headers: 
            {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(
            {
                name: username,
                password: password,
            }),
        });

        // Handle the response
        if (response.ok) 
        {
            const result = await response.text(); 
            document.body.innerHTML = result; 
        } else 
        {
            console.error("Error:", response.statusText);
        }
    } 
    catch (error) 
    {
        console.error("Network error:", error);
    }
};
